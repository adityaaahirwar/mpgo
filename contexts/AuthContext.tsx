import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { UserRole } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  role: UserRole;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'guest',
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<UserRole>('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        
        // SECURITY: Always fetch role from Firestore (source of truth).
        // Do not rely on local storage or client-side caching for roles.
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Validate that the role is valid before setting state
            const fetchedRole = userData.role;
            if (fetchedRole === 'admin' || fetchedRole === 'user') {
              setRole(fetchedRole);
            } else {
               setRole('user'); // Default safe fallback
            }
          } else {
            // User authenticated but no DB record? Likely sync issue or new user.
            setRole('user');
          }
        } catch (error) {
          console.error("Security Error: Failed to verify user role:", error);
          // If role check fails, default to guest or user (least privilege)
          setRole('guest'); 
        }
      } else {
        setUser(null);
        setRole('guest');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setRole('guest');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};