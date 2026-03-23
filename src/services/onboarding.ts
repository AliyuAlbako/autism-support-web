import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export type UserRole =
  | "adult"
  | "caregiver"
  | "clinician"
  | "therapist"
  | "caseworker"
  | "admin";

export async function saveUserRole(
  uid: string,
  email: string | null,
  role: UserRole
) {
  await setDoc(
    doc(db, "users", uid),
    {
      uid,
      email,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function saveRoleProfile<T extends Record<string, unknown>>(
  collectionName:
    | "adult_profiles"
    | "caregiver_profiles"
    | "clinician_profiles"
    | "therapist_profiles"
    | "caseworker_profiles"
    | "admin_profiles",
  uid: string,
  data: T
) {
  await setDoc(
    doc(db, collectionName, uid),
    {
      ...data,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}