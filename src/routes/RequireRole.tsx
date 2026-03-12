import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface Props {
  role: "adult" | "caregiver" | "clinician";
  children: ReactNode;
}

export default function RequireRole({ role, children }: Props) {
  const { user } = useAuth();
  const [status, setStatus] = useState<"loading" | "allowed" | "no-role" | "wrong-role">("loading");
  const [actualRole, setActualRole] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));

      if (!snap.exists()) {
        setStatus("no-role");
        return;
      }

      const data = snap.data();
      const userRole = data.role;
      setActualRole(userRole);

      if (!userRole) {
        setStatus("no-role");
        return;
      }

      if (userRole !== role) {
        setStatus("wrong-role");
        return;
      }

      setStatus("allowed");
    };

    checkRole();
  }, [user, role]);

  if (status === "loading") {
    return <div className="page">Loading...</div>;
  }

  if (status === "no-role") {
    return <Navigate to="/select-role" replace />;
  }

  if (status === "wrong-role") {
    if (actualRole === "adult") return <Navigate to="/adult" replace />;
    if (actualRole === "caregiver") return <Navigate to="/caregiver" replace />;
    if (actualRole === "clinician") return <Navigate to="/clinician" replace />;
    return <Navigate to="/select-role" replace />;
  }

  return <>{children}</>;
}