// Import Firebase configuration and services from register.ts
import { GoogleAuthProvider } from 'firebase/auth';
import { auth, db, analytics } from '../register';
import app from '../register';

// Create Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Re-export Firebase services for backward compatibility
export { auth, db, analytics };
// Export database as an alias for Realtime Database
export const database = db;
export default app;
