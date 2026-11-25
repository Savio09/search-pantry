"use client";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { app, db } from "@/firebase";

// Each browser gets an authenticated identity and its own collection.
export default function useVisitorItems(collectionName) {
  const [uid, setUid] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let stopped = false;
    let unsubscribeItems;
    const fail = () => {
      if (!stopped) { setLoading(false); setError("Could not connect. Please refresh and try again."); }
    };
    const auth = getAuth(app);
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      unsubscribeItems?.();
      if (stopped) return;
      if (!user) {
        signInAnonymously(auth).catch(fail);
        return;
      }
      setUid(user.uid);
      unsubscribeItems = onSnapshot(collection(db, "visitors", user.uid, collectionName), snapshot => {
        if (stopped) return;
        setItems(snapshot.docs.map(item => ({ ...item.data(), id: item.id })));
        setLoading(false);
        setError("");
      }, fail);
    }, fail);
    return () => { stopped = true; unsubscribeAuth(); unsubscribeItems?.(); };
  }, [collectionName]);
  async function mutate(operation) {
    if (!uid || loading || busy) return false;
    setBusy(true); setError("");
    try {
      await operation(collection(db, "visitors", uid, collectionName));
      return true;
    } catch {
      setError("Your change could not be saved. Please try again.");
      return false;
    } finally { setBusy(false); }
  }
  return { items, loading, busy, error, mutate };
}
