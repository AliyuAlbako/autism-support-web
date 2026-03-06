import { db } from "..//services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";

export async function createInviteCode(adultId: string) {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  await addDoc(collection(db, "inviteCodes"), {
    code,
    adultId,
    createdAt: new Date()
  });

  return code;
}

export async function linkCaregiver(code: string, caregiverId: string) {
  const q = query(
    collection(db, "inviteCodes"),
    where("code", "==", code)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Invalid code");
  }

  const invite = snapshot.docs[0].data();

  await addDoc(collection(db, "links"), {
    adultId: invite.adultId,
    caregiverId,
    createdAt: new Date()
  });
}