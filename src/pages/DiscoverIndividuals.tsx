import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";


interface AdultProfile {
  id: string;
  fullName: string;
  city: string;
  state: string;
  goals: string[];
  programs: string[];
  discoverable: boolean;
  allowedRoles?: {
    caregiver?: boolean;
    clinician?: boolean;
    therapist?: boolean;
    caseworker?: boolean;
  };
}

export default function DiscoverIndividuals() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<AdultProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;

      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (!userSnap.exists()) {
          setLoading(false);
          return;
        }

        const currentRole = userSnap.data().role;

        const q = query(
          collection(db, "adult_profiles"),
          where("discoverable", "==", true)
        );

        const snap = await getDocs(q);

        const data = snap.docs
          .map((d) => ({
            id: d.id,
            ...(d.data() as Omit<AdultProfile, "id">),
          }))
          .filter((profile) => {
            if (!profile.allowedRoles) return false;
            if (currentRole === "caregiver") return profile.allowedRoles.caregiver;
            if (currentRole === "clinician") return profile.allowedRoles.clinician;
            if (currentRole === "therapist") return profile.allowedRoles.therapist;
            if (currentRole === "caseworker") return profile.allowedRoles.caseworker;
            return false;
          });

        setProfiles(data);
      } catch (error) {
        console.error("Error fetching discoverable individuals:", error);
      }

      setLoading(false);
    };

    fetchProfiles();
  }, [user]);

  async function sendSupportRequest(adultId: string) {
    if (!user) return;

    try {
      setRequestingId(adultId);

      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (!userSnap.exists()) return;

      const currentRole = userSnap.data().role;

      let requesterName = user.email || "Support Professional";

      const profileCollection =
        currentRole === "caregiver"
          ? "caregiver_profiles"
          : currentRole === "clinician"
          ? "clinician_profiles"
          : currentRole === "therapist"
          ? "therapist_profiles"
          : currentRole === "caseworker"
          ? "caseworker_profiles"
          : "";

      if (profileCollection) {
        const profileSnap = await getDoc(doc(db, profileCollection, user.uid));
        if (profileSnap.exists()) {
          requesterName = profileSnap.data().fullName || requesterName;
        }
      }

      await addDoc(collection(db, "support_requests"), {
        adultId,
        requesterId: user.uid,
        requesterRole: currentRole,
        requesterName,
        status: "pending",
        message: "I would like to provide support.",
        createdAt: serverTimestamp(),
      });

      alert("Support request sent successfully.");
    } catch (error) {
      console.error("Error sending support request:", error);
      alert("Failed to send request.");
    } finally {
      setRequestingId(null);
    }
  }

  if (loading) {
    return <div className="page">Loading available individuals...</div>;
  }

  return (
    <div className="page stack">
      <div className="card">
        <h2 className="section-title">Discover Individuals</h2>
        <p className="subtle">
          Browse autistic individuals who are open to support requests.
        </p>
      </div>

      {profiles.length === 0 ? (
        <div className="card">
          <p className="subtle">No discoverable individuals are available right now.</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {profiles.map((profile) => (
            <div className="card" key={profile.id}>
              <h3 style={{ marginTop: 0 }}>{profile.fullName}</h3>
              <p className="subtle">
                {profile.city}, {profile.state}
              </p>

              <p>
                <strong>Goals:</strong>{" "}
                {profile.goals?.length ? profile.goals.join(", ") : "Not specified"}
              </p>

              <p>
                <strong>Programs:</strong>{" "}
                {profile.programs?.length ? profile.programs.join(", ") : "Not specified"}
              </p>

              <button
                onClick={() => sendSupportRequest(profile.id)}
                disabled={requestingId === profile.id}
              >
                {requestingId === profile.id ? "Sending..." : "Request to Support"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}