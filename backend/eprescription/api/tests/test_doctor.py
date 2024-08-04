from rest_framework.exceptions import status
from rest_framework.serializers import ErrorDetail
from rest_framework.test import APITestCase
from django.urls import reverse
from ..models import User, Doctor


class DoctorTest(APITestCase):
    def setUp(self) -> None:
        gp_data = {
            "user": {
                "email": "gp2@gp.com",
                "first_name": "surgery2",
                "last_name": "name2",
                "password": "gppassword",
            },
            "phone": "02920123123",
            "location": "Cardiff",
            "postcode": "1234567",
        }
        res = self.client.post(reverse("gps-register"), data=gp_data, format="json")
        self.gp_token = res.data["token"]

    def test_register_success(self):
        # add the GP token to the client to register doctors
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.gp_token)

        email = "dr@dr.com"
        data = {
            "user": {
                "email": email,
                "first_name": "new",
                "last_name": "doctor",
                "password": "doctorpassword",
            },
            "title": "Mr",
            "phone": "01237863124",
            "postcode": "CF121AB",
            "date_of_birth": "2002-01-01",
        }
        res = self.client.post(reverse("doctor-register"), data=data, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # test that the nested user model was created and the associated patient
        self.assertTrue(User.objects.filter(email=email).exists())
        self.assertTrue(Doctor.objects.filter(user__email=email).exists())

        self.assertTrue(hasattr(res, "data"), "Response object should have some data")
        data = res.data
        self.assertIsInstance(data.get("token"), str, "Resposne object should have a string token")

        token = data["token"]

        # now use the newly registered doctor's token
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token)
        with self.subTest(name="search patients"):
            res = self.client.get(reverse("patient-search"))
            self.assertEqual(res.status_code, status.HTTP_200_OK)
            self.assertTrue(hasattr(res, "data"), "Response object should have some data")
            self.assertIsInstance(res.data, list, "Response data should be a list")
