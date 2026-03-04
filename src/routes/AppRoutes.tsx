import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RoleSetup from "../pages/RoleSetup";
import AdultDashboard from "../pages/AdultDashboard";
import CaregiverDashboard from "../pages/CaregiverDashboard";
import ClinicianDashboard from "../pages/ClinicianDashboard";
import RequireAuth from "./RequireAuth";
import RequireRole from "./RequireRole";
import CreateRoutine from "../pages/CreateRoutine";
import RoutineView from "../pages/RoutineView";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/setup-role"
        element={
          <RequireAuth>
            <RoleSetup />
          </RequireAuth>
        }
      />

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
    </Routes>
  );
}