import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "..//services/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CreateRoutine() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [steps, setSteps] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const saveRoutine = async () => {
    if (!user) return;
    setLoading(true);

    await addDoc(collection(db, "routines"), {
      ownerId: user.uid,
      name,
      steps: steps.map((s, i) => ({
        id: `${i}`,
        title: s
      })),
      createdAt: new Date()
    });

    navigate("/adult");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Create Routine</h2>

      <input
        placeholder="Routine name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <h4>Steps</h4>
      {steps.map((step, index) => (
        <div key={index}>
          <input
            placeholder={`Step ${index + 1}`}
            value={step}
            onChange={(e) => updateStep(index, e.target.value)}
          />
        </div>
      ))}

      <button onClick={addStep}>Add Step</button>
      <br />
      <button onClick={saveRoutine} disabled={loading}>
        Save Routine
      </button>
    </div>
  );
}