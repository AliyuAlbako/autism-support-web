import { useEffect, useState } from "react";
import { linkCaregiver } from "../services/linkService";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { db } from "../services/firebase";

interface Routine {
  id: string;
  name: string;
}

interface Log {
  id: string;
  routineId: string;
  completedSteps: string[];
  completedAt: any;
}

export default function CaregiverDashboard() {
  const { user } = useAuth();

  const [adultId, setAdultId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [lastLogId, setLastLogId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLink = async () => {
      if (!user) return;

      const q = query(
        collection(db, "links"),
        where("caregiverId", "==", user.uid)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        const data = snap.docs[0].data();
        setAdultId(data.adultId);
      }
    };

    fetchLink();
  }, [user]);

  useEffect(() => {
    if (!adultId) return;

    const q = query(
      collection(db, "routines"),
      where("ownerId", "==", adultId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Routine[];

      setRoutines(data);
    });

    return () => unsubscribe();
  }, [adultId]);

  useEffect(() => {
    if (!adultId) return;

    const q = query(
      collection(db, "routineLogs"),
      where("userId", "==", adultId),
      orderBy("completedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Log[];

      setLogs(data);

      if (data.length > 0) {
        const newest = data[0];

        if (lastLogId && newest.id !== lastLogId) {
          const routineName =
            routines.find((r) => r.id === newest.routineId)?.name || "Routine";

          const time = newest.completedAt
            ?.toDate?.()
            ?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            });

          setAlertMessage(`🎉 ${routineName} finished at ${time}`);
        }

        setLastLogId(newest.id);
      }
    });

    return () => unsubscribe();
  }, [adultId, routines, lastLogId]);

  async function connect() {
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    if (!code) {
      alert("Enter invite code.");
      return;
    }

    await linkCaregiver(code, user.uid);
    alert("Linked successfully!");
    window.location.reload();
  }

  return (
    <div className="page stack">
      <div className="card">
        <h2 className="section-title">Caregiver Dashboard</h2>
        <p className="subtle">
          View linked adult routines and recent activity in real time.
        </p>
      </div>

      {alertMessage && (
        <div className="card">
          <div className="badge-success">{alertMessage}</div>
        </div>
      )}

      {!adultId && (
        <div className="card">
          <h3 className="section-title">Connect to an Adult Account</h3>
          <p className="subtle">
            Enter the invite code shared by the adult to start monitoring progress.
          </p>

          <div className="stack" style={{ maxWidth: 420 }}>
            <input
              placeholder="Enter invite code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <button onClick={connect}>Connect</button>
          </div>
        </div>
      )}

      {adultId && (
        <>
          <div className="card">
            <h3 className="section-title">Adult Routines</h3>

            {routines.length === 0 ? (
              <p className="subtle">No routines yet.</p>
            ) : (
              <ul className="list">
                {routines.map((r) => (
                  <li key={r.id} style={{ marginBottom: 10 }}>
                    {r.name}
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
                    routines.find((r) => r.id === log.routineId)?.name ||
                    "Routine";

                  return (
                    <li key={log.id} style={{ marginBottom: 10 }}>
                      {routineName} — {log.completedSteps.length} steps —{" "}
                      {log.completedAt?.toDate?.().toLocaleString()}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}