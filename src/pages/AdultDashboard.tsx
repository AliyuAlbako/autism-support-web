import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createInviteCode } from "../services/linkService";

interface Routine {
  id: string;
  name: string;
}

interface Log {
  id: string;
  routineId: string;
  completedSteps: string[];
  completedAt: Timestamp;
}

export default function AdultDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  async function generateCode() {
    if (!user) return;

    const code = await createInviteCode(user.uid);
    setInviteCode(code);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);

      try {
        const routineQuery = query(
          collection(db, "routines"),
          where("ownerId", "==", user.uid)
        );

        const routineSnap = await getDocs(routineQuery);

        const routineData = routineSnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Routine, "id">)
        }));

        setRoutines(routineData);

        const logQuery = query(
          collection(db, "routineLogs"),
          where("userId", "==", user.uid),
          orderBy("completedAt", "desc")
        );

        const logSnap = await getDocs(logQuery);

        const logData = logSnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Log, "id">)
        }));

        setLogs(logData);
        calculateStreak(logData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  function calculateStreak(logData: Log[]) {
    const dates = logData
      .map((log) => log.completedAt?.toDate())
      .filter(Boolean)
      .map((d) => d.toDateString());

    const uniqueDates = [...new Set(dates)].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    let count = 0;
    let current = new Date();

    for (let i = 0; i < uniqueDates.length; i++) {
      const date = new Date(uniqueDates[i]);

      if (date.toDateString() === current.toDateString()) {
        count++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    setStreak(count);
  }

  if (loading) {
    return <div className="page">Loading dashboard...</div>;
  }

  return (
    <div className="page stack">
      <div className="card">
        <h3>🔥 Current Streak: {streak} day(s)</h3>
        <p className="subtle">
          Keep completing routines daily to build consistency.
        </p>
      </div>

      <div className="card">
        <h2 className="section-title">My Routines</h2>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <button onClick={() => navigate("/create-routine")}>
            + Create Routine
          </button>

          <button className="secondary" onClick={generateCode}>
            Generate Caregiver Invite
          </button>
        </div>

        {inviteCode && (
          <div className="badge-success" style={{ marginBottom: 16 }}>
            Share this code with caregiver: <b>{inviteCode}</b>
          </div>
        )}

        {routines.length === 0 ? (
          <p className="subtle">No routines yet.</p>
        ) : (
          <ul className="list">
            {routines.map((routine) => (
              <li key={routine.id} style={{ marginBottom: 10 }}>
                <button
                  className="secondary"
                  onClick={() => navigate(`/routine/${routine.id}`)}
                >
                  {routine.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3 className="section-title">Recent Activity</h3>

        {logs.length === 0 ? (
          <p className="subtle">No activity yet.</p>
        ) : (
          <ul className="list">
            {logs.map((log) => {
              const routineName =
                routines.find((r) => r.id === log.routineId)?.name || "Routine";

              return (
                <li key={log.id} style={{ marginBottom: 10 }}>
                  {routineName} — {log.completedSteps.length} steps —{" "}
                  {log.completedAt?.toDate().toLocaleString()}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}