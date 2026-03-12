import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SelectRole from "../pages/SelectRole";
import AdultProfileForm from "../pages/AdultProfileForm";
import CaregiverProfileForm from "../pages/CaregiverProfileForm";
import ClinicianProfileForm from "../pages/ClinicianProfileForm";
import AdultDashboard from "../pages/AdultDashboard";
import CaregiverDashboard from "../pages/CaregiverDashboard";
import ClinicianDashboard from "../pages/ClinicianDashboard";
import RequireAuth from "./RequireAuth";
import RequireRole from "./RequireRole";
import DashboardRedirect from "../pages/DashboardRedirect";
import TherapistProfileForm from "../pages/TherapistProfileForm";
import CaseWorkerProfileForm from "../pages/CaseWorkerProfileForm";
import AdminProfileForm from "../pages/AdminProfileForm";
import TherapistDashboard from "../pages/TherapistDashboard";
import CaseWorkerDashboard from "../pages/CaseWorkerDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import DiscoverIndividuals from "../pages/DiscoverIndividuals";
import IncomingRequests from "../pages/IncomingRequests";
import SupportTeam from "../pages/SupportTeam";
import CreateRoutine from "../pages/CreateRoutine";
import RoutineView from "../pages/RoutineView";


export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Onboarding routes */}
      <Route
        path="/select-role"
        element={
          <RequireAuth>
            <SelectRole />
          </RequireAuth>
        }
      />
      

      <Route
        path="/onboarding/adult"
        element={
          <RequireAuth>
            <AdultProfileForm />
          </RequireAuth>
        }
      />

      <Route
        path="/onboarding/caregiver"
        element={
          <RequireAuth>
            <CaregiverProfileForm />
          </RequireAuth>
        }
      />

      <Route
        path="/onboarding/clinician"
        element={
          <RequireAuth>
            <ClinicianProfileForm />
          </RequireAuth>
        }
      />

      {/* Role dashboards */}
      <Route
        path="/adult"
        element={
          <RequireAuth>
            <RequireRole role="adult">
              <AdultDashboard />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
  path="/routine/:id"
  element={
    <RequireAuth>
      <RequireRole role="adult">
        <RoutineView />
      </RequireRole>
    </RequireAuth>
  }
/>

      <Route
        path="/caregiver"
        element={
          <RequireAuth>
            <RequireRole role="caregiver">
              <CaregiverDashboard />
            </RequireRole>
          </RequireAuth>
        }
      />

      <Route
        path="/clinician"
        element={
          <RequireAuth>
            <RequireRole role="clinician">
              <ClinicianDashboard />
            </RequireRole>
          </RequireAuth>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

      <Route
  path="/dashboard"
  element={
    <RequireAuth>
      <DashboardRedirect />
    </RequireAuth>
  }
/>

<Route
  path="/onboarding/therapist"
  element={
    <RequireAuth>
      <TherapistProfileForm />
    </RequireAuth>
  }
/>

<Route
  path="/onboarding/caseworker"
  element={
    <RequireAuth>
      <CaseWorkerProfileForm />
    </RequireAuth>
  }
/>

<Route
  path="/onboarding/admin"
  element={
    <RequireAuth>
      <AdminProfileForm />
    </RequireAuth>
  }
/>
<Route
  path="/therapist"
  element={
    <RequireAuth>
      <TherapistDashboard />
    </RequireAuth>
  }
/>

<Route
  path="/caseworker"
  element={
    <RequireAuth>
      <CaseWorkerDashboard />
    </RequireAuth>
  }
/>

<Route
  path="/admin"
  element={
    <RequireAuth>
      <AdminDashboard />
    </RequireAuth>
  }
/>

<Route
  path="/discover"
  element={
    <RequireAuth>
      <DiscoverIndividuals />
    </RequireAuth>
  }
/>
<Route
  path="/requests"
  element={
    <RequireAuth>
      <RequireRole role="adult">
        <IncomingRequests />
      </RequireRole>
    </RequireAuth>
  }
/>
<Route
  path="/support-team"
  element={
    <RequireAuth>
      <RequireRole role="adult">
        <SupportTeam />
      </RequireRole>
    </RequireAuth>
  }
/>
<Route
  path="/create-routine"
  element={
    <RequireAuth>
      <RequireRole role="adult">
        <CreateRoutine />
      </RequireRole>
    </RequireAuth>
  }
/>
    </Routes>
  );
}