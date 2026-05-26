import { NextResponse } from "next/server";
import { verifyIdToken, firestore } from "../../../../lib/firebase-admin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { idToken } = body;
    if (!idToken) return NextResponse.json({ ok: false, error: "Missing idToken" }, { status: 400 });

    const decoded = await verifyIdToken(idToken);
    const uid = decoded.uid;

    // Write minimal profile to Firestore (one write on sign-in)
    if (firestore) {
      const docRef = firestore.collection("users").doc(uid);
      await docRef.set(
        {
          uid,
          email: decoded.email || null,
          name: decoded.name || null,
          photoURL: decoded.picture || null,
          lastSignIn: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    return NextResponse.json({ ok: true, uid, email: decoded.email || null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: String(err.message || err) }, { status: 500 });
  }
}
