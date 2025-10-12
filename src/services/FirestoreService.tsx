// src/services/FirestoreService.tsx
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export class FirestoreService {
  private db: firebase.firestore.Firestore;

  constructor() {
    this.db = firebase.firestore();
  }

  /**
   * Get the current diamond balance for a user
   */
  async getDiamondBalance(userId: string): Promise<number> {
    const snapshot = await this.db.collection('users').doc(userId).get();
    return snapshot.data()?.diamonds || 0;
  }

  /**
   * Increment (positive) or decrement (negative) the diamond balance
   */
  async updateDiamondBalance(userId: string, amount: number) {
    await this.db.collection('users').doc(userId).update({
      diamonds: firebase.firestore.FieldValue.increment(amount),
    });
  }

  /**
   * Log a diamond transaction for auditing
   */
  async logTransaction(userId: string, amount: number, type: 'earn' | 'spend') {
    const transaction = {
      amount: Math.abs(amount),
      type,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    await this.db
      .collection('users')
      .doc(userId)
      .collection('transactions')
      .add(transaction);
  }
}

// Export a singleton instance for convenience
const firestoreService = new FirestoreService();
export default firestoreService;