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

  const [routines, setRoutines] = useState<any[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [lastLogId, setLastLogId] = useState<string | null>(null);

  // Fetch caregiver link
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

  // Fetch adult routines
  useEffect(() => {
    const fetchRoutines = async () => {
      if (!adultId) return;

      const q = query(
        collection(db, "routines"),
        where("ownerId", "==", adultId)
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setRoutines(data);
    };

    fetchRoutines();
  }, [adultId]);

  // Real-time routine logs
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
    
      // Detect new completion
      if (data.length > 0) {
        const newest = data[0];
    
        if (lastLogId && newest.id !== lastLogId) {
          const routineName =
            routines.find((r) => r.id === newest.routineId)?.name || "Routine";
    
          const time = newest.completedAt
            ?.toDate?.()
            ?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    
          setAlertMessage(`🎉 ${routineName} finished at ${time}`);
        }
    
        setLastLogId(newest.id);
      }
    });

    return () => unsubscribe();
  }, [adultId]);

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
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Caregiver Dashboard</h2>
      {alertMessage && (
  <div
    style={{
      background: "#d4edda",
      padding: "10px",
      marginBottom: "20px",
      borderRadius: "6px",
      fontWeight: "bold"
    }}
  >
    {alertMessage}
  </div>
)}

      {/* Connect to adult */}
      {!adultId && (
        <>
          <p>No adult linked yet.</p>

          <input
            placeholder="Enter invite code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button onClick={connect}>Connect</button>
        </>
      )}

      {adultId && (
        <>
          <h3>Adult Routines</h3>

          <ul>
            {routines.map((r) => (
              <li key={r.id}>{r.name}</li>
            ))}
          </ul>

          <h3>Recent Activity</h3>

          {logs.length === 0 && <p>No activity yet.</p>}

          <ul>
            {logs.map((log) => {
              const routineName =
                routines.find((r) => r.id === log.routineId)?.name ||
                "Routine";

              return (
                <li key={log.id}>
                  {routineName} — {log.completedSteps.length} steps —{" "}
                  {log.completedAt?.toDate?.().toLocaleString()}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}