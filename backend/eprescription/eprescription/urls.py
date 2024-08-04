from django.contrib import admin
from django.urls import include, path
from api import views
from rest_framework.routers import DefaultRouter
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.permissions import AllowAny

schema_view = get_schema_view(
    openapi.Info(
        title="Electronic Prescription System API",
        default_version='v1',
        description="API documentation for the Electronic Prescription System",
    ),
    public=True,
    permission_classes=(AllowAny,),
)

router = DefaultRouter()
# these routes will also sit under api/
router.register(r'requests', views.PrescriptionRequestView, basename='request')
router.register(r'invites', views.PatientInviteView, basename='invite')
router.register(r'messages', views.MessageView, basename='message')
router.register(r'prescriptions', views.PrescriptionView, basename='prescription')

urlpatterns = [
    path("api/", include([
        path('', include(router.urls)),
        path('', views.api_root, name='api-root'),  # URL for the main API root
        path("model/", views.get_model),
        path('admin/', admin.site.urls),
        path('gp-login/', views.gps_login, name='gps-login'),  # URL for login
        path('gp-register/', views.gps_register, name='gps-register'),  # URL for registration
        path('pharmacy-register/', views.pharmacy_register, name="pharmacy-register"),  # URL for registration
        path('doctor-register/', views.doctor_register, name='doctor-register'),  # URL for doctor registration
        path("login/", views.Authenticate.as_view(), name="login"),
        path("auth/", views.auth, name="auth"),
        path("logins/", views.get_logins, name="logins"),
        path("check-password/", views.check_password),
        path("create-otp/", views.create_otp, name="create-otp"),
        path("check-save-otp/", views.check_and_save_otp),
        path("check-remove-otp/", views.check_and_remove_otp),
        path("register/", views.patient_register, name="patient-register"),
        path("find/", views.find_patient),
        path("patient/<int:id>/", views.PatientView.as_view()),
        path("patients/", views.PatientSearchView.as_view(), name="patient-search"),
        path("changepassword/", views.change_password),
        path("resetpassword/", views.reset_password_request),
        path('reset-password-confirm/<uidb64>/<token>/', views.reset_password_confirm, name='reset_password_confirm'),
        path('verify-email/', views.verify_email, name='verify_email'),
        path('logout/', views.logout, name='logout'),
        #path("request/new", views.new_prescription_request),
        #path("request/", views.PrescriptionRequestView.as_view()),
        path("medication/", views.MedicationView.as_view()),
        path("delete-account/", views.delete_account),
        path("accept-invite/<int:invite_id>/", views.accept_invite),
        path("gp/<int:id>/", views.GpUpdate.as_view()),
        path("doctor/<int:id>/", views.DoctorUpdate.as_view()),
        path("doctors/", views.ListDoctorView.as_view()),
        path("pharmacies/", views.ListPharmacyView.as_view()),

        path("user/<int:id>/", views.UserView.as_view()),

        path("download-data/", views.download_data),

        path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
        path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
        path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    ]))
]
