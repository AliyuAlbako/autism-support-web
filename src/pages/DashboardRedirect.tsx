import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    const resolveTarget = async () => {
      if (!user) {
        setTarget("/login");
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));

      if (!snap.exists()) {
        setTarget("/select-role");
        return;
      }

      const role = snap.data().role;

      if (role === "adult") setTarget("/adult");
      else if (role === "caregiver") setTarget("/caregiver");
      else if (role === "clinician") setTarget("/clinician");
      else setTarget("/select-role");
    };

    if (!loading) resolveTarget();
  }, [user, loading]);

  if (loading || !target) {
    return <div className="page">Loading...</div>;
  }

  return <Navigate to={target} replace />;
}