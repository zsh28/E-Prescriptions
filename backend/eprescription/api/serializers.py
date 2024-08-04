import re
from django.contrib.auth.models import Group
from datetime import datetime
from django.contrib.auth.hashers import make_password
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.fields import CurrentUserDefault
from .models import Doctor, DoctorGroup, GpGroup, Gps, Login, Medication, Message, Patient, PatientInvite, Pharmacy, Prescription, PrescriptionRequest, User, UserManager
from django.contrib.auth.password_validation import validate_password

def validate_phone(phone):
    pattern = r'^\d{11}$'
    if re.match(pattern, phone) is None:
        raise serializers.ValidationError("Phone number must be exactly 11 digitts")
    return phone

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', "first_name", "last_name", 'password']
        extra_kwargs = {
                "password": {"write_only": True},
                }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def validate_email(self, email):
        norm_email = UserManager.normalize_email(email)
        if User.objects.filter(email=norm_email).exists():
            raise serializers.ValidationError("User with this email already exists")
        return norm_email

    def validate_password(self, value):
        validate_password(value)
        return value

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for user data

    class Meta:
        model = Doctor
        fields = ['user', 'title', 'phone']

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)
        if user_data:
            self.fields["user"].update(instance.user, user_data)
        return super(DoctorSerializer, self).update(instance, validated_data)

    def create(self, validated_data, gp=None):
        user_data = validated_data.pop("user")
        user = User.objects.create_user(**user_data)
        doctor = Doctor.objects.create(user=user, gp=gp, **validated_data)
        doctor_group, _ = Group.objects.get_or_create(name=DoctorGroup.name)
        user.groups.add(doctor_group)
        return doctor

    def validate_phone(self, phone):
        return validate_phone(phone)
    
    
class GpsSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for user data

    class Meta:
        model = Gps
        fields = ['user','phone', 'location', 'postcode']

    def create(self, validated_data):
        # Extract nested user data
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        gp = Gps.objects.create(user=user, **validated_data)
        return gp

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)
        if user_data:
            self.fields["user"].update(instance.user, user_data)
        return super(GpsSerializer, self).update(instance, validated_data)

    def validate_phone(self, phone):
        return validate_phone(phone)

    # TODO: validate phone, location, postcode

class PharmacySerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for user data

    class Meta:
        model = Pharmacy
        fields = ["id", 'user','phone', 'location']

    def create(self, validated_data):
        # Extract nested user data
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        pharmacy = Pharmacy.objects.create(user=user, **validated_data)
        return pharmacy

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)
        if user_data:
            self.fields["user"].update(instance.user, user_data)
        return super(PharmacySerializer, self).update(instance, validated_data)


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    pharmacy_model = PharmacySerializer(read_only=True, source="pharmacy")
    date_of_birth = serializers.DateField(required=True)

    class Meta:
        model = Patient
        fields = ("id", "user", "title", "phone", "postcode", "date_of_birth", "pharmacy", "pharmacy_model")

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user = User.objects.create_user(**user_data)
        patient = Patient.objects.create(user=user, **validated_data)
        return patient

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["pharmacy"] = representation.pop("pharmacy_model")
        return representation

    def validate_date_of_birth(self, dob):
        if datetime.today().date() < dob:
            raise serializers.ValidationError("Date of birth must be in the past")
        return dob

    def validate_phone(self, phone):
        return validate_phone(phone)

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)
        if user_data:
            self.fields["user"].update(instance.user, user_data)
        return super(PatientSerializer, self).update(instance, validated_data)


class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ("id", "name", "description", "dosage", "side_effects")

    def validate_dosage(self, dosage):
        """
        validates that the dosage follows <number><unit>
        """
        units = '|'.join(["mg", "g", "mcg", "kg", "ml"]) # creates a regex OR for all of the allowed units
        pattern = rf'^\d+(\.\d+)?({units})$'
        if re.match(pattern, dosage) is None:
            raise serializers.ValidationError("Invalid dosage format")
        return dosage


class PrescriptionRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for a prescription request.
    Created by a logged in patient giving only the medication ID but returns
    the info about the request as well as the entire info about the medication.
    """
    patient = PatientSerializer(default=CurrentUserDefault())
    medication_model = MedicationSerializer(read_only=True, source="medication")

    class Meta:
        model = PrescriptionRequest
        fields = ("id", "patient", "medication", "reason", "medication_model", "status", "date_updated", "date_created")
        read_only_fields = ("date_created", )
        # make the model only on output and the ID ony on input
        extra_kwargs = {
                "medication_model": {"read_only": True},
                }

    def to_representation(self, instance):
        # swap medication_id and medication in the json so that the serialized
        # version of medication is used
        representation = super().to_representation(instance)
        representation["medication"] = representation.pop("medication_model")
        return representation

    def validate_patient(self, _):
        user = self.context["request"].user
        patient = Patient.objects.filter(user_id=user.id).first()
        return patient

    def validate_date_updated(self, date_updated):
        if datetime.today().date() < date_updated:
            raise serializers.ValidationError("Date updated must be in the past")
        return date_updated


class PatientInviteSerializer(serializers.ModelSerializer):
    patient_details = serializers.SerializerMethodField()
    gp_details = serializers.SerializerMethodField()
    class Meta:
        model = PatientInvite
        fields = ("id", "patient", "gp", "date_created", "status", "patient_details", "gp_details")
        extra_kwargs = {
                # because we create the invite using the ID but will want patient_details on read
                "gp": {"write_only": True},
                "patient": {"write_only": True}
                }


    def validate_patient(self, patient):
        if patient.gps is not None:
            raise serializers.ValidationError("Patient already belongs to a GP")
        return patient

    # used with SerializerMethodField
    def get_patient_details(self, obj):
        # returns the entire serialized patient model
        patient = PatientSerializer(obj.patient).data
        return {
                "id": patient["id"],
                "title": patient["title"],
                "first_name": patient["user"]["first_name"],
                "last_name": patient["user"]["last_name"],
                }

    def get_gp_details(self, obj):
        return {
                "id": obj.gp.id,
                "name": obj.gp.user.first_name + " " + obj.gp.user.last_name,
                }
    def to_representation(self, instance):
        # change patient_details to patient on output
        representation = super().to_representation(instance)
        representation["patient"] = representation.pop("patient_details")
        representation["gp"] = representation.pop("gp_details")
        return representation


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ("id", "patient", "read", "date_created", "text")
        extra_kwargs = {
                "text": {"required": True}
                }

    def update(self, instance, validated_data):
        # prevent fields from being updated
        validated_data.pop("patient", None)
        validated_data.pop("text", None)
        return super().update(instance, validated_data)

    def validate_patient(self, patient):
        user = self.context["request"].user
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        groups = list(user.groups.values_list('name',flat = True)) 
        gp = None
        if GpGroup.name in groups:
            gp = Gps.objects.filter(user_id=user.id).first()
        elif DoctorGroup.name in groups:
            dr = Doctor.objects.filter(user_id=user.id).first()
            gp = dr.gp
        if gp is None:
            raise serializers.ValidationError("You are not part of a GP")
        if patient.gps is None or patient.gps.id != gp.id:
            raise serializers.ValidationError("That patient is not part of your GP")
        return patient

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = ("timestamp", )


class PrescriptionSerializer(serializers.ModelSerializer):
    """
    Serializer for a prescription.
    Created by a doctor after approving a PrescriptionRequest
    then accessed by the patient's chosen pharmacy.
    """
    patient = PatientSerializer()
    doctor = DoctorSerializer()
    medication = MedicationSerializer()
    class Meta:
        model = Prescription
        fields = ("id", "patient", "doctor", "medication", "pharmacy", "date", "date_updated", "status")
