import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

interface SupportRequest {
  id: string;
  adultId: string;
  requesterId: string;
  requesterRole: string;
  requesterName: string;
  status: string;
  message: string;
  createdAt?: any;
}

export default function IncomingRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function fetchRequests() {
    if (!user) return;

    try {
      const q = query(
        collection(db, "support_requests"),
        where("adultId", "==", user.uid),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<SupportRequest, "id">),
      }));

      setRequests(data);
    } catch (error) {
      console.error("Error fetching support requests:", error);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchRequests();
  }, [user]);

  async function handleAccept(request: SupportRequest) {
    try {
      setProcessingId(request.id);

      await updateDoc(doc(db, "support_requests", request.id), {
        status: "accepted",
        respondedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "support_team_members"), {
        adultId: request.adultId,
        memberId: request.requesterId,
        role: request.requesterRole,
        name: request.requesterName,
        status: "active",
        createdAt: serverTimestamp(),
      });

      await fetchRequests();
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request.");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDecline(request: SupportRequest) {
    try {
      setProcessingId(request.id);

      await updateDoc(doc(db, "support_requests", request.id), {
        status: "declined",
        respondedAt: serverTimestamp(),
      });

      await fetchRequests();
    } catch (error) {
      console.error("Error declining request:", error);
      alert("Failed to decline request.");
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return <div className="page">Loading requests...</div>;
  }

  return (
    <div className="page stack">
      <div className="card">
        <h2 className="section-title">Incoming Support Requests</h2>
        <p className="subtle">
          Review support requests from caregivers and professionals.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="card">
          <p className="subtle">No pending support requests.</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {requests.map((request) => (
            <div className="card" key={request.id}>
              <h3 style={{ marginTop: 0 }}>{request.requesterName}</h3>
              <p className="subtle" style={{ textTransform: "capitalize" }}>
                Role: {request.requesterRole}
              </p>

              <p>
                <strong>Message:</strong>{" "}
                {request.message || "I would like to provide support."}
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={() => handleAccept(request)}
                  disabled={processingId === request.id}
                >
                  {processingId === request.id ? "Processing..." : "Accept"}
                </button>

                <button
                  className="secondary"
                  onClick={() => handleDecline(request)}
                  disabled={processingId === request.id}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}