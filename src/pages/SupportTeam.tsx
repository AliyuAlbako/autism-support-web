import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

interface TeamMember {
  id: string;
  adultId: string;
  memberId: string;
  role: string;
  name: string;
  status: string;
}

export default function SupportTeam() {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "support_team_members"),
          where("adultId", "==", user.uid),
          where("status", "==", "active")
        );

        const snap = await getDocs(q);

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<TeamMember, "id">),
        }));

        setMembers(data);
      } catch (error) {
        console.error("Error fetching support team:", error);
      }

      setLoading(false);
    };

    fetchTeam();
  }, [user]);

  if (loading) {
    return <div className="page">Loading support team...</div>;
  }

  return (
    <div className="page stack">
      <div className="card">
        <h2 className="section-title">My Support Team</h2>
        <p className="subtle">
          View the caregivers and professionals currently approved to support you.
        </p>
      </div>

      {members.length === 0 ? (
        <div className="card">
          <p className="subtle">No support team members yet.</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {members.map((member) => (
            <div className="card" key={member.id}>
              <h3 style={{ marginTop: 0 }}>{member.name}</h3>
              <p className="subtle" style={{ textTransform: "capitalize" }}>
                Role: {member.role}
              </p>
              <p>Status: {member.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}