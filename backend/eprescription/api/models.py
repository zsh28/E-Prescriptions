from django.contrib.auth.models import AbstractUser, BaseUserManager, Group
from django.db import models
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils.timezone import now


# People login using their credentials which corresponds to a User

# Implementation code from https://docs.djangoproject.com/en/5.0/topics/auth/customizing/#a-full-example
# https://docs.djangoproject.com/en/5.0/topics/auth/customizing/#writing-a-manager-for-a-custom-user-model
class UserManager(BaseUserManager):
    """
    make the email unique rather than the username
    """

    def create_user(self, email, password, first_name, last_name, **fields):
        if not email:
            raise ValueError("The user email must be set")
        if not password:
            raise ValueError("The user password must be set")
        if not first_name:
            raise ValueError("The user first_name must be set")
        if not last_name:
            raise ValueError("The user last_name must be set")
        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            **fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, first_name, last_name, **fields):
        user = self.create_user(email, password, first_name, last_name, **fields)
        user.is_admin = True
        user.save(using=self._db)
        return user


# Custom user class that uses email instead of username
class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    first_name = models.CharField("first name", max_length=150)
    last_name = models.CharField("last name", max_length=150)
    verified = models.BooleanField(default=False)
    otp_secret = models.CharField(null=True, blank=True)


    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["password", "first_name", "last_name"]

    objects = UserManager()

    def send_verification_email(self):
        subject = 'Verify Your Email'
        message = render_to_string('email_verification.html', {
            'user': self,
            'verification_link': f'http://domain.com/verify-email/?token={self.pk}',
        })
        send_mail(subject, strip_tags(message), 'from@example.com', [self.email], html_message=message)

    def verify_email(self):
        self.verified = True
        self.save()

    def __str__(self):
        return self.email


class PatientGroup(Group):
    name = "patient_group"

class GpGroup(Group):
    name = "gp_group"

class DoctorGroup(Group):
    name = "doctor_group"

class PharmacyGroup(Group):
    name = "pharmacy_group"

#model for gps data
# - user
# - phone
# - location
class Gps(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='gps_profile')
    phone = models.CharField(max_length=100, verbose_name='Phone', help_text='Enter your phone')
    location = models.CharField(max_length=100, verbose_name='Location', help_text='Enter your location')
    postcode = models.CharField(max_length=100, verbose_name='Postcode', help_text='Enter your postcode')

    def __str__(self):
        return self.user.first_name
    
    class Meta:
        verbose_name = 'Surgery'
        verbose_name_plural = 'Surgeries'

#model for pharmacy
# - phone
# - location
class Pharmacy(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='pharmacy_profile')
    phone = models.CharField(max_length=100, verbose_name='Phone', help_text='Enter your phone')
    location = models.CharField(max_length=100, verbose_name='Location', help_text='Enter your location')

    class Meta:
        verbose_name = 'Pharmacy'
        verbose_name_plural = 'Pharmacies'


#model for doctor
# - user
# - phone
# - location
# - fk to gps id
        
class Doctor(models.Model):
    TITLE_CHOICES = [
        ('Dr', 'Dr'),
        ('Mr', 'Mr'),
        ('Mrs', 'Mrs'),
        ('Miss', 'Miss'),
        ('Other', 'Other'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    title = models.CharField(max_length=5, choices=TITLE_CHOICES, verbose_name='Title', help_text='Enter your title')
    phone = models.CharField(max_length=100, verbose_name='Phone', help_text='Enter your phone')
    gp = models.ForeignKey(Gps, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        verbose_name = 'Doctor'
        verbose_name_plural = 'Doctors'

#model for patient
# - user
# - phone
# - postcode 
# - fk to doctor id
# - fk to gps id
        
class Patient(models.Model):
    TITLE_CHOICES = [
        ('Mr', 'Mr'),
        ('Mrs', 'Mrs'),
        ('Miss', 'Miss'),
        ('Other', 'Other'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    title = models.CharField(max_length=5, choices=TITLE_CHOICES, verbose_name='Title', help_text='Enter your title')
    phone = models.CharField(max_length=100, verbose_name='Phone', help_text='Enter your phone')
    postcode = models.CharField(max_length=100, verbose_name='Postcode', help_text='Enter your postcode')
    gps = models.ForeignKey(Gps, on_delete=models.CASCADE, null=True, blank=True)
    date_of_birth = models.DateField()
    pharmacy = models.ForeignKey(Pharmacy, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = 'Patient'
        verbose_name_plural = 'Patients'

#model for medication
# - name
# - description
# - dosage
# - side effects
        
class Medication(models.Model):
    name = models.CharField(max_length=100, verbose_name='Name', help_text='Enter the name', null=False, blank=False)
    description = models.TextField(max_length=1000, verbose_name='Description', help_text='Enter the description', null=True, blank=True)
    dosage = models.CharField(max_length=100, verbose_name='Dosage', help_text='Enter the dosage', null=False, blank=False)
    side_effects = models.TextField(max_length=1000, verbose_name='Side Effects', help_text='Enter the side effects', null=True, blank=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Medication'
        verbose_name_plural = 'Medications'


#model for prescription
# - prescription id
# - fk to patient id
# - fk to doctor id
# - fk to medication id
# - fk to pharmacy id
# - date
        
class Prescription(models.Model):
    STATUS_CHOICES = [
            ("PENDING", ) * 2,
            ("READY", ) * 2,
            ("COLLECTED", ) * 2,
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True, blank=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, null=True, blank=True)
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE, null=True, blank=True)
    pharmacy = models.ForeignKey(Pharmacy, on_delete=models.CASCADE, null=True, blank=True)
    date = models.DateField(verbose_name='Date', help_text='Enter the date')
    date_updated = models.DateTimeField(blank=True, null=True, verbose_name="Date last updated")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, verbose_name='Status', null=False, blank=False, default="PENDING")

    class Meta:
        verbose_name = 'Prescription'
        verbose_name_plural = 'Prescriptions'

class PrescriptionRequest(models.Model):
    """
    This references a Patient and a Medication NOT a Prescription. This is
    because once the PrescriptionRequest has been accepted then a Prescription
    will be created which contains the info about who prescribed it, how long
    the prescripition lasts etc. - this info is not known until the request has
    been approved.
    """
    STATUS_CHOICES = [
            ("ACCEPTED", ) * 2,
            ("PENDING", ) * 2,
            ("REJECTED", ) * 2,
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=False, blank=False)
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE, null=False, blank=False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, verbose_name='Status', null=False, blank=False, default="PENDING")
    date_created = models.DateTimeField(default=now, editable=False, verbose_name="Creation date")
    date_updated = models.DateTimeField(blank=True, null=True, verbose_name="Date last updated")
    reason = models.CharField(verbose_name="Reason for request")

    def convert_to_prescription(self, doctor):
        if self.status == "ACCEPTED":
            Prescription.objects.create(
                patient=self.patient,
                doctor=doctor,
                medication=self.medication,
                date=now(),
                pharmacy=self.patient.pharmacy
            )

    class Meta:
        # there cannot be two requests from the same patient for the same
        # medication, preventing multiple requests for the same thing
        unique_together = ("patient", "medication", "status")


#model for storage of resseting password tokens
# - user
# - token
        
class PasswordResetToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True)

class TokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            force_str(user.pk) + force_str(timestamp) +
            force_str(user.is_active)
        )

password_reset_token = TokenGenerator()


class PatientInvite(models.Model):
    STATUS_CHOICES = [
            ("ACCEPTED", ) * 2,
            ("PENDING", ) * 2,
            ("REJECTED", ) * 2,
    ]

    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, null=False, blank=False)
    gp = models.OneToOneField(Gps, on_delete=models.CASCADE, null=False, blank=False)
    date_created = models.DateTimeField(default=now, editable=False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")

    class Meta:
        unique_together = ("patient", "gp")
        verbose_name = 'Patient invite'
        verbose_name_plural = 'Patient invites'


class Message(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=False, blank=False)
    read = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=now, editable=False)
    text = models.CharField("text", max_length=250, null=False, blank=False)

class Login(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)
    timestamp = models.DateTimeField(default=now, editable=False)
    ip_hash = models.CharField()
