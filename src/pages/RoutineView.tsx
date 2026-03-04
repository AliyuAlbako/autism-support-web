import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "..//services/firebase";
import { useAuth } from "../context/AuthContext";

interface Step {
  id: string;
  title: string;
}

export default function RoutineView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoutine = async () => {
      if (!id) return;

      const snap = await getDoc(doc(db, "routines", id));

      if (!snap.exists()) return;

      const data = snap.data();
      setName(data.name);
      setSteps(data.steps);
    };

    fetchRoutine();
  }, [id]);

  const toggleStep = (stepId: string) => {
    if (completed.includes(stepId)) {
      setCompleted(completed.filter((id) => id !== stepId));
    } else {
      setCompleted([...completed, stepId]);
    }
  };

  const completeRoutine = async () => {
    if (!user || !id) return;

    await addDoc(collection(db, "routineLogs"), {
      routineId: id,
      userId: user.uid,
      completedSteps: completed,
      completedAt: new Date()
    });

    navigate("/adult");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>{name}</h2>

      {steps.map((step) => (
        <div key={step.id}>
          <label>
            <input
              type="checkbox"
              checked={completed.includes(step.id)}
              onChange={() => toggleStep(step.id)}
            />
            {step.title}
          </label>
        </div>
      ))}

      <br />
      <button onClick={completeRoutine}>
        Complete Routine
      </button>
    </div>
  );
}