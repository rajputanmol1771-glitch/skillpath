// components/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, ADMIN_EMAIL } from "./firebase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        let userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const assignedRole = firebaseUser.email === ADMIN_EMAIL ? "admin" : "student";
          await setDoc(userRef, {
            email: firebaseUser.email,
            role: assignedRole,
            name: firebaseUser.displayName || "",
          });
          userSnap = await getDoc(userRef);
        }

        setUser(firebaseUser);
        setRole(userSnap.data().role);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
