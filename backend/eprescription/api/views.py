from django.db.models import Q
from django.utils.decorators import method_decorator
from typing_extensions import ReadOnly
from django.contrib.auth.models import Group, UserManager
from rest_framework import status, generics, viewsets
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.authtoken.views import ObtainAuthToken, Token
from .models import Doctor, DoctorGroup, GpGroup, Gps, Login, Medication, Message, Patient, PatientGroup, PatientInvite, Pharmacy, PharmacyGroup, Prescription, PrescriptionRequest, User, PasswordResetToken, password_reset_token
from .serializers import GpsSerializer, DoctorSerializer, LoginSerializer, MedicationSerializer, MessageSerializer, PatientInviteSerializer, PatientSerializer, PharmacySerializer, PrescriptionRequestSerializer, PrescriptionSerializer, UserSerializer
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from django.http import FileResponse, JsonResponse
from rest_framework.permissions import IsAuthenticated, BasePermission, SAFE_METHODS
from .auth import InGroup
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from datetime import timedelta
from django.utils import timezone
from drf_yasg.utils import serializers, swagger_auto_schema
from drf_yasg import openapi
import pyotp
import base64
import qrcode
from io import BytesIO
import hashlib
import json

from django.core.exceptions import (
    ValidationError,
)


class NoCreate(BasePermission):
    """
    Permission class to only allow read or update operations
    """
    def has_permission(self, request, view):
        return request.method != "POST"

class CreateOnly(BasePermission):
    """
    Permission class to only allow creation
    """
    def has_permission(self, request, view):
        return request.method == "POST"

class ReadOnly(BasePermission):
    """
    Permission class to only allow read only operations
    """
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS

class NoUpdate(BasePermission):
    """
    Permission class to disallow updating
    """
    def has_permission(self, request, view):
        return view.action != "update" and view.action != "partial_update"

class Authenticate(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        request.data["username"] = request.data.get("email")
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        has_otp = user.otp_secret is not None and user.otp_secret != ""
        if has_otp:
            code = request.data.get("code")
            if code is None:
                return Response({"code": "A OTP is enabled on this account"}, status=status.HTTP_400_BAD_REQUEST)
            totp = pyotp.totp.TOTP(user.otp_secret)
            if totp.now() != code:
                return Response({"code": "This code is incorrect"}, status=status.HTTP_401_UNAUTHORIZED)
        
        token, created = Token.objects.get_or_create(user=user)
        groups = list(user.groups.values_list('name',flat = True)) 

        response = {
            'token': token.key,
            'user_id': user.pk,
            "groups": groups,
        }

        if GpGroup.name in groups:
            gp = Gps.objects.filter(user_id=user.id).first()
            response["gp_id"] = gp.id
        if PatientGroup.name in groups:
            patient = Patient.objects.filter(user_id=user.id).first()
            response["patient_id"] = patient.id
        if DoctorGroup.name in groups:
            doctor = Doctor.objects.filter(user_id=user.id).first()
            response["doctor_id"] = doctor.id

        response["user"] = UserSerializer(user).data
        response["has_otp"] = has_otp

        # record the login
        # https://stackoverflow.com/a/4581997
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[-1]
        else:
            ip = request.META.get('REMOTE_ADDR')
        ip_hash = hashlib.sha256(bytes(ip, "utf8")).hexdigest()
        Login.objects.create(user=user, ip_hash=ip_hash)

        # TODO: send an email informing the user about the new login

        return Response(response)

@swagger_auto_schema(
        method='post',
        operation_description="Fetch the user id and groups of an authenticated user",
        responses={
            200: openapi.Response("Successful request")
        }
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def auth(request):
    groups = list(request.user.groups.values_list('name',flat = True)) 

    user = request.user
    has_otp = user.otp_secret is not None and user.otp_secret != ""
    response = {
        "first_name": request.user.first_name,
        "last_name": request.user.last_name,
        'user_id': request.user.pk,
        "groups": groups,
        "has_otp": has_otp,
    }

    if GpGroup.name in groups:
        gp = Gps.objects.filter(user_id=user.id).first()
        response["gp_id"] = gp.id
    if PatientGroup.name in groups:
        patient = Patient.objects.filter(user_id=user.id).first()
        response["patient_id"] = patient.id
    if DoctorGroup.name in groups:
        doctor = Doctor.objects.filter(user_id=user.id).first()
        response["doctor_id"] = doctor.id
    response["user"] = UserSerializer(user).data

    return Response(response, status=status.HTTP_200_OK)


@method_decorator(
        name='retrieve',
        decorator=swagger_auto_schema(
            operation_summary="Retrieve a single patient record based on the requesting user's group.",
            operation_description="GP and Doctor users can see those within the same GP. Patient users can only see themselves.",
))
class PatientView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()
    lookup_field = "id"
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        # accessing a patient's information
        # create a message for the patient if the user is not the patient themselves
        patient = self.get_object()
        user = request.user
        if user.id != patient.user.id:
            # someone else is accessing the patient's information, send a message to the user
            # but first check if a message was already sent about this in the last minute
            last_minute = timezone.now() - timedelta(minutes=5)
            if not Message.objects.filter(
                    Q(text__icontains="accessed")
                    & Q(text__icontains=user.first_name)
                    & Q(text__icontains=user.last_name)
                    & Q(date_created__gte=last_minute)
                    ).exists():
                # there is not already a message in the last minute about this
                # so send one
                groups = list(user.groups.values_list('name',flat = True)) 
                message_text = "Somebody accessed your records"
                if GpGroup.name in groups:
                    message_text = f"GP '{user.first_name} {user.last_name}' accessed your records"
                elif DoctorGroup.name in groups:
                    message_text = f"Dr '{user.first_name} {user.last_name}' accessed your records"
                Message.objects.create(patient=patient, text=message_text)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # updating a patient's information
        # create a message for the patient if the user is not the patient themselves
        patient = self.get_object()
        user = request.user
        if user.id != patient.user.id:
            # someone else is updating the patient's information
            groups = list(user.groups.values_list('name',flat = True)) 
            message_text = "Somebody accessed your records"

            updated_fields = []
            for key in request.data.keys():
                if key == "user":
                    for user_key in request.data["user"]:
                        updated_fields.append(user_key.replace("_", " "))
                else:
                    updated_fields.append(key)
            updated_fields = ', '.join(updated_fields)
            if GpGroup.name in groups:
                message_text = f"GP '{user.first_name} {user.last_name}' updated your " + updated_fields
            elif DoctorGroup.name in groups:
                message_text = f"Dr '{user.first_name} {user.last_name}' updated your " + updated_fields
            Message.objects.create(patient=patient, text=message_text)
        return super().update(request, *args, **kwargs)

    def get_queryset(self):
        groups = list(self.request.user.groups.values_list('name',flat = True)) 
        if GpGroup.name in groups:
            # gps can see everyone
            gp = Gps.objects.filter(user_id=self.request.user.id).first()
            return self.queryset.filter(gps_id=gp.id)
        elif DoctorGroup.name in groups:
            # doctors can only see patients in the same GP
            gp = Doctor.objects.filter(user_id=self.request.user.id).first().gp
            gp_id = None if gp is None else gp.id
            return self.queryset.filter(gps_id=gp_id)
        else:
            # TODO: add elif for pharmacy
            return self.queryset.filter(user_id=self.request.user.id)


class PatientSearchView(generics.ListAPIView):
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()
    permission_classes = [InGroup(DoctorGroup.name)|InGroup(GpGroup.name)]

    def get_queryset(self):
        groups = list(self.request.user.groups.values_list('name',flat = True)) 
        gp = None
        if GpGroup.name in groups:
            gp = Gps.objects.filter(user_id=self.request.user.id).first()
        else:
            gp = Doctor.objects.filter(user_id=self.request.user.id).first().gp
        gp_id = None if gp is None else gp.id
        return self.queryset.filter(gps_id=gp_id)

    @swagger_auto_schema(
            operation_summary="List all patients belonging to the requesting user's GP.",
            operation_description="Only GPs and Doctors may call this route.",
            responses={
                200: openapi.Response('Successful retrieval', PatientSerializer(many=True)),
                401: 'Unauthorized'
            },
    )
    @action(detail=True, methods=["GET"])
    def get(self, *args, **kwargs):
        return super().get(*args, **kwargs)


class PrescriptionRequestView(viewsets.ModelViewSet):
    serializer_class = PrescriptionRequestSerializer
    queryset = PrescriptionRequest.objects.all()
    # can only be updated by doctors, otherwise just read only for everyone else
    permission_classes = [IsAuthenticated, InGroup(DoctorGroup.name)|NoUpdate]
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        groups = list(user.groups.values_list('name',flat = True)) 
        if GpGroup.name in groups:
            gp = Gps.objects.filter(user_id=user.id).first()
            return self.queryset.filter(patient__gps=gp)
        elif PatientGroup.name in groups:
            patient = Patient.objects.filter(user_id=user.id).first()
            return self.queryset.filter(patient=patient)
        elif DoctorGroup.name in groups:
            dr = Doctor.objects.filter(user_id=user.id).first()
            return self.queryset.filter(patient__gps=dr.gp)
        else:
            return None
        
    def perform_update(self, serializer):
        old_status = self.get_object().status
        instance = serializer.save()
        if old_status != instance.status:
            doctor = Doctor.objects.filter(user_id=self.request.user.id).first()
            instance.convert_to_prescription(doctor)

@api_view(["POST"])
@permission_classes([IsAuthenticated, InGroup(PatientGroup.name)])
def new_prescription_request(request):
    """
    API endpoint for a patient to create a new prescription request
    User: Patient
    Result: New PrescriptionRequest in the database
    """
    serializer = PrescriptionRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.create(serializer.validated_data)
    return Response(status=status.HTTP_200_OK) 
    

@api_view(["POST"])
def patient_register(request):
    """
    API endpoint to register new users
    """
    serializer = PatientSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    patient = serializer.create(serializer.validated_data)
    patient_group, _ = Group.objects.get_or_create(name="patient_group")
    user = patient.user
    user.groups.add(patient_group)
    token = Token.objects.create(user=user)
    #user.send_verification_email()
    return Response({"token": token.key, "id": user.id})

@api_view(['POST'])
# Register a new GP
def gps_register(request):
    #get data from the request
    serializer = GpsSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    gp = serializer.create(serializer.validated_data)
    gp_group, _ = Group.objects.get_or_create(name=GpGroup.name)

    user = gp.user
    user.groups.add(gp_group)
    #user.send_verification_email()
    token = Token.objects.create(user=user)
    return Response({"token": token.key, "id": user.id})
    
@api_view(['POST'])
def gps_login(request):
    # Check if the user exists
    user = get_object_or_404(User, email=request.data['username'])
    if not user.check_password(request.data['password']):
        # If the password is incorrect, return an error
        return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)
    # If the password is correct, return the user's token and profile
    token, created = Token.objects.get_or_create(user=user)
    # Serialize the user's profile
    serializer = GpsSerializer(user.gps_profile)
    # Return the token and profile
    return Response({'token': token.key, 'user': serializer.data})

@api_view(['POST'])
# Register a new GP
def pharmacy_register(request):
    #get data from the request
    serializer = PharmacySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    pharmacy = serializer.create(serializer.validated_data)
    pharmacy_group, _ = Group.objects.get_or_create(name=PharmacyGroup.name)

    user = pharmacy.user
    user.groups.add(pharmacy_group)
    #user.send_verification_email()
    token = Token.objects.create(user=user)
    return Response({"token": token.key, "id": user.id})

#doctor register this function should ensure a gp is logged in before a doctor can be registered
@api_view(['POST'])
@permission_classes([IsAuthenticated, InGroup(GpGroup.name)])
def doctor_register(request):
    # get data from the request
    serializer = DoctorSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    gp = Gps.objects.filter(user_id=request.user.id).first()
    doctor = serializer.create(serializer.validated_data, gp=gp)
    #send_verification_email = User.send_verification_email
    #send_verification_email(doctor.user)

    doctor_group, _ = Group.objects.get_or_create(name=DoctorGroup.name)
    user = doctor.user
    user.groups.add(doctor_group)
    token = Token.objects.create(user=user)
    return Response({"id": doctor.id, "token": token.key})

#doctor login
@api_view(['POST'])
def doctor_login(request):
    # Check if the user exists
    user = get_object_or_404(User, email=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)
    token, created = Token.objects.get_or_create(user=user)
    serializer = DoctorSerializer(user.doctor_profile)
    return Response({'token': token.key, 'user': serializer.data})

#pharmacy register
@api_view(['POST'])




def api_root(request):
    """
    this view can be changed with a html page to display the available API endpoints at the end of the project
    View function to display available API endpoints.
    """
    data = {
        'gps-register': '/gp-register/',
        'gps-login': '/gp-login/',
        'description': 'This is the main API root. You can use the endpoints above to register and login as a GP.',
        'doctor-register': '/doctor-register/',
        'doctor-login': '/doctor-login/',
        'description': 'This is the main API root. You can use the endpoints above to register and login as a Doctor.',
    }
    return JsonResponse(data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    current_password = request.data.get("currentPassword")
    new_password = request.data.get("newPassword")
    if not current_password:
        return Response({'error': 'Current password is required'}, status=status.HTTP_400_BAD_REQUEST)
    if not new_password:
        return Response({'error': 'New password is required'}, status=status.HTTP_400_BAD_REQUEST)

    if not request.user.check_password(current_password):
        return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(new_password)
    except ValidationError as error:
        return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

    request.user.set_password(new_password)
    request.user.save()
    return Response(status=status.HTTP_200_OK) 

@api_view(['POST'])
def reset_password_request(request):
    email = request.data.get("email")
    user = User.objects.filter(email=email).first()
    if user:
        token = password_reset_token.make_token(user)
        expiration_time = timezone.now() + timedelta(hours=1)  # Token expires in 1 hour
        PasswordResetToken.objects.update_or_create(user=user, defaults={'token': token, 'expires_at': expiration_time})
        send_reset_email(user, token)
        return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)
    return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)

def send_reset_email(user, token):
    subject = 'Password Reset'
    email_template_name = 'reset_password_email.txt'
    email_context = {
        'user': user,
        'domain': 'your-domain.com',
        'token': token,
    }
    email = render_to_string(email_template_name, email_context)
    send_mail(subject, email, 'from@example.com', [user.email])

@api_view(['POST'])
def reset_password_confirm(request):
    uidb64 = request.data.get("uidb64")
    token = request.data.get("token")
    newpassword = request.data.get("newpassword")
    confirmpassword = request.data.get("confirmpassword")
    
    if newpassword != confirmpassword:
        return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    
    if user is not None:
        reset_token = PasswordResetToken.objects.filter(user=user, token=token).first()
        if reset_token and reset_token.expires_at > timezone.now():
            user.set_password(newpassword)
            user.save()
            reset_token.delete()  # Delete the token after successful password reset
            return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid token or token has expired'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid token or user'}, status=status.HTTP_400_BAD_REQUEST)
    

#verify emails
@api_view(['POST'])
def verify_email(request):
    if request.method == 'POST':
        token = request.data.get('token')  # Retrieve token from request data
        if token:
            try:
                user = User.objects.get(pk=token)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Invalid token'}, status=404)  
            user.verify_email()
            return JsonResponse({'message': 'Email verified successfully'})  
        else:
            return JsonResponse({'error': 'Token not provided'}, status=400) 
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)  
    
#logout a user
@api_view(['POST'])
def logout(request):
    request.user.auth_token.delete()
    return JsonResponse({'message': 'User logged out successfully'}, status=200)  # Return success message


class MedicationView(generics.ListCreateAPIView):
    serializer_class = MedicationSerializer
    queryset = Medication.objects.all()
    loookup_field = "id"
    # medication can be viewed by any user but only created by a GP
    # TODO: would it be better for Doctors to create medication?
    permission_classes = [IsAuthenticated, InGroup(GpGroup.name)|ReadOnly]

    #@swagger_auto_schema(
    #operation_description="List all medications or create new medication",
    #responses={
    #    200: openapi.Response('Successful retrieval', MedicationSerializer(many=True)),
    #    201: openapi.Response('Successfully created', MedicationSerializer),
    #    403: 'Forbidden'
    #    }
    #)
    #def get(self, request, *args, **kwargs):
    #    return super().get(request, *args, **kwargs)

    #@swagger_auto_schema(
    #    operation_description="Create a new medication",
    #    request_body=MedicationSerializer,
    #    responses={
    #        201: 'Successfully created',
    #        403: 'Forbidden'
    #    }
    #)
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

@method_decorator(
    name="list",
    decorator=swagger_auto_schema(
        operation_summary="Retrieve all invites for the requesting user",
        operation_description="GP users are shown all requests made for the GP they belong to. Patient users are shown all invites sent to them.",
        responses={
            200: openapi.Response('Successful retrieval', PatientInviteSerializer(many=True)),
        }
))
@method_decorator(
    name="create",
    decorator=swagger_auto_schema(
        operation_summary="Creates a new invite for a patient to the requesting GP.",
        operation_description="Only GPs are able to call this route. Invites the specified patient to the user's GP. Doctors are unable to view this route.",
))
class PatientInviteView(viewsets.ModelViewSet):
    serializer_class = PatientInviteSerializer
    queryset = PatientInvite.objects.all()
    # GPs and patients but patients cannot create invites
    permission_classes = [IsAuthenticated, InGroup(GpGroup.name)|(InGroup(PatientGroup.name)&NoCreate)]
    lookup_field = "id"

    def get_queryset(self):
        groups = list(self.request.user.groups.values_list('name',flat = True)) 
        if GpGroup.name in groups:
            gp = Gps.objects.filter(user_id=self.request.user.id).first()
            return self.queryset.filter(gp_id=gp.id)
        else:
            # patient
            patient = Patient.objects.filter(user_id=self.request.user.id).first()
            return self.queryset.filter(patient_id=patient.id)


@api_view(["POST"])
@permission_classes([IsAuthenticated, InGroup(GpGroup.name)])
def find_patient(request):
    email = request.data.get("email")
    if not email:
        return Response({"email": ["This field is required"]}, status=status.HTTP_400_BAD_REQUEST)

    email = UserManager.normalize_email(email)
    try:
        validate_email(email)
    except ValidationError as e:
        return Response({"email": e})

    user = User.objects.filter(email=email).first()
    if not user:
        return Response({"email": ["No patient with this email."]}, status=status.HTTP_404_NOT_FOUND)

    patient = Patient.objects.filter(user_id=user.id).first()
    if not patient:
        return Response({"email": ["No patient with this email."]}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        "user_id": user.id,
        "patient_id": patient.id
        }, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    patient = Patient.objects.filter(user_id=user.id).first()

    if patient:
        patient.delete()
        return Response({"message": "Patient account deleted successfully."}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "No patient account found for this user."}, status=status.HTTP_404_NOT_FOUND)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_model(request):
    user = request.user
    groups = list(user.groups.values_list('name',flat = True)) 
    
    if GpGroup.name in groups:
        gp = Gps.objects.filter(user_id=user.id).first()
        return Response(GpsSerializer(gp).data)
    elif DoctorGroup.name in groups:
        dr = Doctor.objects.filter(user_id=user.id).first()
        return Response(DoctorSerializer(dr).data)
    else:
        patient = Patient.objects.filter(user_id=user.id).first()
        return Response(PatientSerializer(patient).data)

@api_view(["POST"])
@permission_classes([IsAuthenticated, InGroup(PatientGroup.name)])
def accept_invite(request, invite_id):
    invite = get_object_or_404(PatientInvite, pk=invite_id)
    invite.status = "ACCEPTED"
    invite.save()
    user = request.user
    patient = Patient.objects.filter(user_id=user.id).first()
    if not patient:
        return Response({"message": "User is not a patient"}, status=status.HTTP_400_BAD_REQUEST)

    patient.gps = invite.gp
    patient.save()
    return Response(status=status.HTTP_200_OK)


class MessageView(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()
    # everyone except patients can create messages, but only patients may read/update
    permission_classes = [IsAuthenticated, CreateOnly | (InGroup(PatientGroup.name) & NoCreate)]
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        groups = list(user.groups.values_list('name',flat = True)) 
        if PatientGroup.name in groups:
            patient = Patient.objects.filter(user_id=user.id).first()
            return self.queryset.filter(patient=patient)

        gp = None
        if GpGroup.name in groups:
            gp = Gps.objects.filter(user_id=user.id).first()
        elif DoctorGroup.name in groups:
            dr = Doctor.objects.filter(user_id=user.id).first()
            gp = dr.gp
        if gp is None:
            return []

        return self.queryset.filter(patient__gps=gp)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_otp(request):
    secret = pyotp.random_base32()
    totp = pyotp.totp.TOTP(secret).provisioning_uri(
            name=request.user.email, issuer_name='EPrescription')

    qr_img = qrcode.make(totp)
    buffer = BytesIO()
    qr_img.save(buffer)
    qr_64 = base64.b64encode(buffer.getvalue())

    return Response({"totp": totp, "base64": qr_64, "secret": secret})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def check_and_save_otp(request):
    secret = request.data.get("secret")
    if not secret:
        return Response({"secret": "This field is required"}, status=status.HTTP_400_BAD_REQUEST)
    code = request.data.get("code")
    if not code:
        return Response({"code": "This field is required"}, status=status.HTTP_400_BAD_REQUEST)
    totp = pyotp.totp.TOTP(secret).now()
    if totp != code:
        return Response({"code": "This code is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

    request.user.otp_secret = secret
    request.user.save()
    return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def check_and_remove_otp(request):
    code = request.data.get("code")
    if not code:
        return Response({"code": "This field is required"}, status=status.HTTP_400_BAD_REQUEST)

    user = request.user
    has_otp = user.otp_secret is not None and user.otp_secret != ""
    if not has_otp:
        return Response({"code": "You do not have an OTP active"}, status=status.HTTP_400_BAD_REQUEST)

    totp = pyotp.totp.TOTP(user.otp_secret)
    if totp.now() != code:
        return Response({"code": "This code is incorrect"}, status=status.HTTP_401_UNAUTHORIZED)

    request.user.otp_secret = None
    request.user.save()
    return Response(status=status.HTTP_200_OK)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def check_password(request):
    password = request.data.get("password")
    if not password:
        return Response({"password": "Please enter your password"}, status=status.HTTP_400_BAD_REQUEST)
    if not request.user.check_password(password):
        return Response({"password": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_logins(request):
    logins = Login.objects.filter(user_id=request.user.id)
    serializer = LoginSerializer(logins, many=True)
    return Response(serializer.data)


class PrescriptionView(mixins.CreateModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.ListModelMixin,
                   viewsets.GenericViewSet):
    serializer_class = PrescriptionSerializer
    queryset = Prescription.objects.all()
    # pharmacy can view and update, doctors can only create
    permission_classes = [IsAuthenticated, (InGroup(PharmacyGroup.name) & NoCreate) | (InGroup(DoctorGroup.name) & CreateOnly) | (InGroup(PatientGroup.name) & ReadOnly)]
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        groups = list(user.groups.values_list('name',flat = True)) 

        queryset = self.queryset
        if PharmacyGroup.name in groups:
            pharmacy = Pharmacy.objects.filter(user_id=user.id).first()
            queryset = queryset.filter(pharmacy=pharmacy)
        elif DoctorGroup.name in groups:
            doctor = Doctor.objects.filter(user_id=user.id).first()
            queryset = queryset.filter(doctor=doctor)
        elif PatientGroup.name in groups:
            patient = Patient.objects.filter(user_id=user.id).first()
            queryset = queryset.filter(patient=patient)

        p_status = self.request.query_params.get('status')
        if p_status is not None and p_status != "":
            queryset = queryset.filter(status=p_status.upper())

        return queryset


class GpUpdate(generics.UpdateAPIView):
    serializer_class = GpsSerializer
    queryset = Gps.objects.all()
    lookup_field = "id"
    permission_classes = [IsAuthenticated, InGroup(GpGroup.name)]

    def get_queryset(self):
        return self.queryset.filter(user_id=self.request.user.id)



class DoctorUpdate(generics.UpdateAPIView):
    serializer_class = DoctorSerializer
    queryset = Doctor.objects.all()
    lookup_field = "id"
    permission_classes = [IsAuthenticated, InGroup(DoctorGroup.name)]

    def get_queryset(self):
        return self.queryset.filter(user_id=self.request.user.id)


class ListPharmacyView(generics.ListAPIView):
    serializer_class = PharmacySerializer
    queryset = Pharmacy.objects.all()
    lookup_field = "id"
    permission_classes = [IsAuthenticated]


class ListDoctorView(generics.ListAPIView):
    serializer_class = DoctorSerializer
    queryset = Doctor.objects.all()
    lookup_field = "id"
    permission_classes = [IsAuthenticated, InGroup(GpGroup.name)]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def download_data(request):
    user = request.user
    groups = list(user.groups.values_list('name',flat = True)) 
    data = {}
    if GpGroup.name in groups:
        gp = Gps.objects.filter(user_id=user.id).first()
        data["gp"] = GpsSerializer(gp).data
    if PatientGroup.name in groups:
        patient = Patient.objects.filter(user_id=user.id).first()
        data["patient"] = PatientSerializer(patient).data
        messages = Message.objects.filter(patient=patient)
        data["messages"] = MessageSerializer(messages, many=True).data
        requests = PrescriptionRequest.objects.filter(patient=patient)
        data["prescription_requests"] = PrescriptionRequestSerializer(requests, many=True).data
        prescriptions = Prescription.objects.filter(patient=patient)
        data["prescriptions"] = PrescriptionSerializer(prescriptions, many=True).data
    if DoctorGroup.name in groups:
        doctor = Doctor.objects.filter(user_id=user.id).first()
        data["doctor"] = DoctorSerializer(doctor).data

    logins = Login.objects.filter(user=user)
    data["logins"] = LoginSerializer(logins, many=True).data

    buffer = BytesIO()
    buffer.write(json.dumps(data).encode())
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename="data.json")


class UserView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
