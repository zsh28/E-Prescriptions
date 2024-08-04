from rest_framework.authtoken.models import Token
from rest_framework.exceptions import status
from rest_framework.serializers import ErrorDetail
from rest_framework.test import APITestCase
from django.urls import reverse
from ..models import User


class UserTest(APITestCase):
    def setUp(self) -> None:
        self.email = "patient@patient.com"
        self.password = "patientpassword"
        self.user = User.objects.create_user(
            email=self.email,
            first_name="First",
            last_name="Last",
            password=self.password,
        )
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)

    def test_create_otp(self):
        res = self.client.post(reverse("create-otp"))
        data = res.data
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIsInstance(data, dict, "Resposne object should be a dict")
        self.assertIsInstance(data.get("totp"), str, "Response should have totp")
        self.assertIsInstance(data.get("base64"), bytes, "Response should have base64")
        self.assertIsInstance(data.get("secret"), str, "Response should have secret")

    def test_auth(self):
        res = self.client.post(reverse("auth"))
        data = res.data
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIsInstance(data, dict, "Resposne object should be a dict")
        self.assertIsInstance(data.get("groups"), list, "Response should have list of groups")
        self.assertIsInstance(data.get("user"), dict, "Response should have user model")

    def test_logins(self):
        res = self.client.get(reverse("logins"))
        data = res.data
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIsInstance(data, list, "Response data should be list")
        if len(data) > 0:
            self.assertTrue(hasattr(data[0], "timestamp"), "Login should have timestamp")

    def test_login(self):
        res = self.client.post(reverse("login"), data={"email": self.email, "password": self.password}, format="json")
        data = res.data
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIsInstance(data, dict, "Response data should be dict")
        self.assertIsInstance(data.get("token"), str, "Response should have token")

    def test_login_invalid(self):
        res = self.client.post(reverse("login"), data={"email": self.email, "password": "incorrect"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_dr_register_access(self):
        res = self.client.post(reverse("doctor-register"))
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
