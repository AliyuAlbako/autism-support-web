import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

export default function AdultDashboard() {
  const [streak, setStreak] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch routines
      const routineQuery = query(
        collection(db, "routines"),
        where("ownerId", "==", user.uid)
      );

      const routineSnap = await getDocs(routineQuery);

      const routineData = routineSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Routine[];

      setRoutines(routineData);

      // Fetch logs
      const logQuery = query(
        collection(db, "routineLogs"),
        where("userId", "==", user.uid),
        orderBy("completedAt", "desc")
      );

      const logSnap = await getDocs(logQuery);

      const logData = logSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Log[];

      setLogs(logData);
      // Calculate streak
const dates = logData.map(log =>
  log.completedAt?.toDate?.().toDateString()
);

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
    };

    fetchData();
  }, [user]);

  return (
    <div style={{ padding: 40 }}>
      <h3>🔥 Current Streak: {streak} day(s)</h3>
      <h2>My Routines</h2>

      <button onClick={() => navigate("/create-routine")}>
        + Create Routine
      </button>

      <ul>
        {routines.map((routine) => (
          <li key={routine.id}>
            <button onClick={() => navigate(`/routine/${routine.id}`)}>
              {routine.name}
            </button>
          </li>
        ))}
      </ul>

      <hr />

      <h3>Recent Activity</h3>

      {logs.length === 0 && <p>No activity yet.</p>}

      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            {routines.find(r => r.id === log.routineId)?.name || "Routine"} — 
            {log.completedSteps.length} steps — 
             {log.completedAt?.toDate?.().toLocaleString()}
</li>
        ))}
      </ul>
    </div>
  );
}