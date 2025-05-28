import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  user,
  UserCredential
} from '@angular/fire/auth';
import { 
  Firestore, 
  collection, 
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  collectionData 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  user$: Observable<any>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.user$ = user(this.auth);
  }

  // Authentication methods
  async signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async signOut(): Promise<void> {
    return signOut(this.auth);
  }

  // Firestore methods
  getCollection<T>(collectionPath: string): Observable<T[]> {
    const collectionRef = collection(this.firestore, collectionPath);
    return collectionData(collectionRef, { idField: 'id' }) as Observable<T[]>;
  }

  async addDocument(collectionPath: string, data: any): Promise<string> {
    const collectionRef = collection(this.firestore, collectionPath);
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  }

  async setDocument(collectionPath: string, docId: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, collectionPath, docId);
    return setDoc(docRef, data);
  }

  async updateDocument(collectionPath: string, docId: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, collectionPath, docId);
    return updateDoc(docRef, data);
  }

  async deleteDocument(collectionPath: string, docId: string): Promise<void> {
    const docRef = doc(this.firestore, collectionPath, docId);
    return deleteDoc(docRef);
  }

  async getDocument<T>(collectionPath: string, docId: string): Promise<T | undefined> {
    const docRef = doc(this.firestore, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
      return undefined;
    }
  }

  async queryCollection<T>(
    collectionPath: string, 
    fieldPath: string, 
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=', 
    value: any
  ): Promise<T[]> {
    const collectionRef = collection(this.firestore, collectionPath);
    const q = query(collectionRef, where(fieldPath, operator, value));
    const querySnapshot = await getDocs(q);
    
    const results: T[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as T);
    });
    
    return results;
  }
}
