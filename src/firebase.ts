import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  collection, 
  onSnapshot, 
  updateDoc, 
  getDocFromServer,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { 
  SubscriptionItem, 
  Invoice, 
  ClientProject, 
  ITAsset 
} from './types';
import { 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_INVOICES, 
  INITIAL_PROJECTS, 
  INITIAL_IT_ASSETS 
} from './data/mockData';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with Database ID (MANDATORY in AI Studio)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Provider for Google Auth
const googleProvider = new GoogleAuthProvider();

// Error handling conforming to skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
}

// Connection test
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Client is offline or network restricted. Local cache active.");
    }
    return false;
  }
}

// User Profile model
export interface AppUserProfile {
  uid: string;
  email: string;
  displayName: string;
  institution: string;
  role: 'client' | 'admin';
  phone?: string;
  createdAt: string;
}

// Auth Helpers
export async function registerUser(email: string, password: string, displayName: string, institution: string) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;
    
    await updateProfile(user, { displayName });

    const role = email === 'benisius.rb@gmail.com' || email.includes('admin') ? 'admin' : 'client';
    const profile: AppUserProfile = {
      uid: user.uid,
      email: user.email || email,
      displayName: displayName || email.split('@')[0],
      institution: institution || 'Umum / Mandiri',
      role,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', user.uid), profile);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }

    return profile;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal mendaftar akun');
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = cred.user;
    
    // Fetch profile
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        return snap.data() as AppUserProfile;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
    }

    const role = (user.email === 'benisius.rb@gmail.com' || user.email?.includes('admin')) ? 'admin' : 'client';
    const fallbackProfile: AppUserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Pengguna',
      institution: 'Instansi / Pengguna',
      role,
      createdAt: new Date().toISOString()
    };
    return fallbackProfile;
  } catch (error: any) {
    throw new Error(error.message || 'Email atau password salah');
  }
}

export async function loginWithGoogle() {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const user = cred.user;

    const role = (user.email === 'benisius.rb@gmail.com' || user.email?.includes('admin')) ? 'admin' : 'client';
    const profile: AppUserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Akun Google',
      institution: 'Mitra Google',
      role,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }

    return profile;
  } catch (error: any) {
    throw new Error(error.message || 'Login dengan Google gagal');
  }
}

export async function logoutUser() {
  await signOut(auth);
}

// Database Seeder & Sync Initializer
export async function initializeFirestoreData() {
  try {
    // 1. Seed Subscriptions if empty
    const subSnap = await getDocs(collection(db, 'subscriptions'));
    if (subSnap.empty) {
      console.log('Seeding initial subscriptions to Firestore...');
      const batch = writeBatch(db);
      INITIAL_SUBSCRIPTIONS.forEach(item => {
        batch.set(doc(db, 'subscriptions', item.id), item);
      });
      await batch.commit();
    }

    // 2. Seed Invoices if empty
    const invSnap = await getDocs(collection(db, 'invoices'));
    if (invSnap.empty) {
      console.log('Seeding initial invoices to Firestore...');
      const batch = writeBatch(db);
      INITIAL_INVOICES.forEach(item => {
        batch.set(doc(db, 'invoices', item.id), item);
      });
      await batch.commit();
    }

    // 3. Seed Projects if empty
    const prjSnap = await getDocs(collection(db, 'projects'));
    if (prjSnap.empty) {
      console.log('Seeding initial projects to Firestore...');
      const batch = writeBatch(db);
      INITIAL_PROJECTS.forEach(item => {
        batch.set(doc(db, 'projects', item.id), item);
      });
      await batch.commit();
    }

    // 4. Seed IT Assets if empty
    const astSnap = await getDocs(collection(db, 'it_assets'));
    if (astSnap.empty) {
      console.log('Seeding initial IT assets to Firestore...');
      const batch = writeBatch(db);
      INITIAL_IT_ASSETS.forEach(item => {
        batch.set(doc(db, 'it_assets', item.id), item);
      });
      await batch.commit();
    }
  } catch (error) {
    console.warn('Initial seeding note (will use cached/local state if Firestore permissions restrict batch):', error);
  }
}

// Real-time Firestore Sync Helpers
export function subscribeToFirestore(
  onSubsUpdate: (subs: SubscriptionItem[]) => void,
  onInvsUpdate: (invs: Invoice[]) => void,
  onPrjsUpdate: (prjs: ClientProject[]) => void,
  onAssetsUpdate?: (assets: ITAsset[]) => void
) {
  // Subscriptions listener
  const unsubSubs = onSnapshot(collection(db, 'subscriptions'), (snapshot) => {
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => d.data() as SubscriptionItem);
      onSubsUpdate(list);
    }
  }, (err) => handleFirestoreError(err, OperationType.GET, 'subscriptions'));

  // Invoices listener
  const unsubInvs = onSnapshot(collection(db, 'invoices'), (snapshot) => {
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => d.data() as Invoice);
      onInvsUpdate(list);
    }
  }, (err) => handleFirestoreError(err, OperationType.GET, 'invoices'));

  // Projects listener
  const unsubPrjs = onSnapshot(collection(db, 'projects'), (snapshot) => {
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => d.data() as ClientProject);
      onPrjsUpdate(list);
    }
  }, (err) => handleFirestoreError(err, OperationType.GET, 'projects'));

  let unsubAssets = () => {};
  if (onAssetsUpdate) {
    unsubAssets = onSnapshot(collection(db, 'it_assets'), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => d.data() as ITAsset);
        onAssetsUpdate(list);
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'it_assets'));
  }

  return () => {
    unsubSubs();
    unsubInvs();
    unsubPrjs();
    unsubAssets();
  };
}

// Firestore Mutation Functions
export async function saveSubscriptionToFirestore(sub: SubscriptionItem) {
  try {
    await setDoc(doc(db, 'subscriptions', sub.id), sub);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `subscriptions/${sub.id}`);
  }
}

export async function saveInvoiceToFirestore(inv: Invoice) {
  try {
    await setDoc(doc(db, 'invoices', inv.id), inv);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `invoices/${inv.id}`);
  }
}

export async function updateInvoicePaymentInFirestore(invoiceId: string, paymentMethod: string, referenceNo: string) {
  try {
    await updateDoc(doc(db, 'invoices', invoiceId), {
      status: 'paid',
      paidDate: new Date().toLocaleString('id-ID'),
      paymentMethod,
      referenceNumber: referenceNo
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `invoices/${invoiceId}`);
  }
}

export async function saveProjectToFirestore(proj: ClientProject) {
  try {
    await setDoc(doc(db, 'projects', proj.id), proj);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `projects/${proj.id}`);
  }
}

export async function saveITAssetToFirestore(asset: ITAsset) {
  try {
    await setDoc(doc(db, 'it_assets', asset.id), asset);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `it_assets/${asset.id}`);
  }
}

// Superadmin Functions for Firestore
export async function deleteSubscriptionFromFirestore(subId: string) {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'subscriptions', subId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `subscriptions/${subId}`);
  }
}

export async function updateSubscriptionInFirestore(subId: string, updates: Partial<SubscriptionItem>) {
  try {
    await updateDoc(doc(db, 'subscriptions', subId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `subscriptions/${subId}`);
  }
}

export async function deleteProjectFromFirestore(projId: string) {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'projects', projId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `projects/${projId}`);
  }
}

