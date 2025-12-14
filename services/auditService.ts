import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type AuditAction = 
  | 'CREATE_JOB' 
  | 'UPDATE_JOB' 
  | 'DELETE_JOB' 
  | 'UPDATE_APPLICATION_STATUS' 
  | 'DELETE_APPLICATION'
  | 'SYSTEM_CONFIG_CHANGE';

/**
 * Logs an administrative action to the restricted 'auditLogs' collection.
 * This is executed client-side but protected by Firestore Rules (only admins can write).
 */
export const logAdminAction = async (
  action: AuditAction, 
  targetId: string, 
  description: string,
  metadata?: any
) => {
  const user = auth.currentUser;

  if (!user) {
    console.error("Audit Log Failed: No authenticated user");
    return;
  }

  try {
    await addDoc(collection(db, "auditLogs"), {
      actionType: action,
      adminId: user.uid,
      adminEmail: user.email,
      targetId: targetId,
      description: description,
      timestamp: serverTimestamp(),
      metadata: metadata || {}
    });
    console.log(`Audit Log Created: [${action}] ${description}`);
  } catch (error) {
    // This will fail if the user is not an admin (enforced by Security Rules)
    console.error("Security Alert: Failed to write audit log. User might not be admin.", error);
  }
};