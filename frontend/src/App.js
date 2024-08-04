import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./routes/Home";
import { ErrorPage } from "./routes/ErrorPage";
import { LoginPage } from "./routes/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserPage } from "./routes/UserPage";
import { AuthProvider } from "./providers/AuthProvider";
import Register from "./routes/register";
import { AboutPage } from "./routes/AboutPage";
import { PrivacyPage, TermsPage } from "./routes/TermsPage";
import { PatientAccount } from "./routes/patientView/patientAccount";
import { PatientPrescriptions } from "./routes/patientView/patientPrescriptions";
import { PatientRequests } from "./routes/patientView/patientRequests";
import { Logout } from "./routes/Logout";
import { PatientRequestForm } from "./routes/patientView/patientRequestForm";
import { DoctorDashboard } from "./routes/doctorView";
import { DoctorPatients } from "./routes/doctorView/doctorPatients";
import CookiePolicy from "./routes/cookies";
import Help from "./routes/help";
import { DoctorGPPatientView } from "./routes/doctorGpPatientview";
import { DoctorPrescriptions } from "./routes/doctorView/doctorPrescription";
import { GpPatients } from "./routes/gpView/gpPatients";
import { GpInvite } from "./routes/gpView/gpInvite";
import { ManageAccount } from "./components/ManageAccount";
import ActivePrescriptions from "./routes/patientView/ActivePrescriptions";
import { PatientMessages } from "./routes/patientView/messages";
import PharmacyPrescriptionManager from "./routes/pharmacyView/PharmacyPrescriptionManager";
import { PatientPharmacy } from "./routes/patientView/patientPharmacy";
import { GpDoctors } from "./routes/gpView/gpDoctors";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "help",
        element: <Help />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "privacypolicy",
        element: <PrivacyPage />,
      },
      {
        path: "cookies",
        element: <CookiePolicy />,
      },
      {
        path: "termsofuse",
        element: <TermsPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "account",
            element: <ManageAccount />,
          },
          {
            path: "/dashboard",
            element: <UserPage />,
          },
          {
            path: "pharmacy",
            children: [
              {
                path: "prescriptions",
                element: <PharmacyPrescriptionManager />,
              },
            ],
          },
          {
            path: "gp",
            children: [
              {
                path: "invite",
                element: <GpInvite />,
              },
              {
                path: "patients",
                element: <GpPatients />,
              },
              {
                path: "doctors",
                element: <GpDoctors />,
              },
            ],
          },
          {
            path: "doctor",
            children: [
              {
                path: "",
                element: <DoctorDashboard />,
              },
              {
                path: "patients",
                element: <DoctorPatients />,
              },
              {
                path: "patient/:patientId",
                element: <DoctorGPPatientView />,
              },
              {
                path: "prescriptions",
                element: <DoctorPrescriptions />,
              },
            ],
          },
          {
            path: "patient/:patientId",
            element: <DoctorGPPatientView />,
          },
          {
            path: "patient",
            children: [
              {
                path: "",
                element: <PatientAccount />,
              },
              {
                path: "pharmacy",
                element: <PatientPharmacy />,
              },
              {
                path: "messages",
                element: <PatientMessages />,
              },
              {
                path: "prescriptions",
                children: [
                  {
                    path: "",
                    element: <PatientPrescriptions />,
                  },
                  {
                    path: "active",
                    element: <ActivePrescriptions />,
                  },
                ],
              },
              {
                path: "requests",
                children: [
                  {
                    path: "",
                    element: <PatientRequests />,
                  },
                  {
                    path: "new",
                    element: <PatientRequestForm />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
