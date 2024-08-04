from rest_framework.exceptions import status
from rest_framework.serializers import ErrorDetail
from rest_framework.test import APITestCase
from django.urls import reverse
from ..models import User, Patient


class PatientTest(APITestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_user(
            email="patient@patient.com",
            first_name="First",
            last_name="Last",
            password="patientpassword",
        )
        self.patient = Patient.objects.create(
            user=self.user,
            title="Mr",
            phone="01234567890",
            postcode="CF122AB",
            date_of_birth="2000-01-01",
        )

    def test_register_success(self):
        email =  "patient2@patient.com"
        data = {
            "user": {
                "email": email,
                "first_name": "new",
                "last_name": "patient",
                "password": "patientpassword",
            },
            "title": "Mr",
            "phone": "01237863124",
            "postcode": "CF121AB",
            "date_of_birth": "2002-01-01",
        }
        res = self.client.post(reverse("patient-register"), data=data, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # test that the nested user model was created and the associated patient
        self.assertTrue(User.objects.filter(email=email).exists())
        self.assertTrue(Patient.objects.filter(user__email=email).exists())

    def test_register_existing(self):
        data = {
            "user": {
                "email": "patient@patient.com",
                "first_name": "richard",
                "last_name": "thorn",
                "password": "patientpassword",
            },
            "title": "Mr",
            "phone": "01237863124",
            "postcode": "CF121AB",
            "date_of_birth": "2002-01-01",
        }
        res = self.client.post(reverse("patient-register"), data=data, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            res.data,
            {
                "user": {
                    "email": [
                        ErrorDetail(
                            string="user with this email already exists.", code="unique"
                        )
                    ]
                }
            },
        )

