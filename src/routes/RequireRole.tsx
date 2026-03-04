import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

interface Props {
  role: "adult" | "caregiver" | "clinician";
  children: JSX.Element;
}

export default function RequireRole({ role, children }: Props) {
  const { user } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));

      if (!snap.exists()) {
        setAllowed(false);
        return;
      }

      const userRole = snap.data().role;
      setAllowed(userRole === role);
    };

    checkRole();
  }, [user, role]);

  if (allowed === null) return <div>Loading...</div>;

  if (!allowed) return <Navigate to="/setup-role" replace />;

  return children;
}