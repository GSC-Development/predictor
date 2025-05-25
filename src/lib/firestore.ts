import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import type { 
  User, 
  League, 
  Fixture, 
  Prediction,
  CreateUserData,
  CreateLeagueData,
  CreateFixtureData,
  CreatePredictionData 
} from "@/types";

// Collections references
export const usersCollection = collection(db, "users");
export const leaguesCollection = collection(db, "leagues");
export const fixturesCollection = collection(db, "fixtures");
export const predictionsCollection = collection(db, "predictions");

// User functions
export const createUser = async (userData: CreateUserData): Promise<string> => {
  const docRef = await addDoc(usersCollection, {
    ...userData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getUser = async (userId: string): Promise<User | null> => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as User;
  }
  return null;
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    ...userData,
    updatedAt: Timestamp.now()
  });
};

// League functions
export const createLeague = async (leagueData: CreateLeagueData): Promise<string> => {
  const docRef = await addDoc(leaguesCollection, {
    ...leagueData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getLeague = async (leagueId: string): Promise<League | null> => {
  const docRef = doc(db, "leagues", leagueId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as League;
  }
  return null;
};

export const getPublicLeagues = async (): Promise<League[]> => {
  const q = query(
    leaguesCollection, 
    where("isPublic", "==", true),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as League[];
};

// Fixture functions
export const createFixture = async (fixtureData: CreateFixtureData): Promise<string> => {
  const docRef = await addDoc(fixturesCollection, {
    ...fixtureData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getUpcomingFixtures = async (leagueType?: string): Promise<Fixture[]> => {
  let q = query(
    fixturesCollection,
    where("matchDate", ">", Timestamp.now()),
    orderBy("matchDate", "asc"),
    limit(20)
  );

  if (leagueType) {
    q = query(
      fixturesCollection,
      where("leagueType", "==", leagueType),
      where("matchDate", ">", Timestamp.now()),
      orderBy("matchDate", "asc"),
      limit(20)
    );
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Fixture[];
};

// Prediction functions
export const createPrediction = async (predictionData: CreatePredictionData): Promise<string> => {
  const docRef = await addDoc(predictionsCollection, {
    ...predictionData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getUserPredictions = async (userId: string): Promise<Prediction[]> => {
  const q = query(
    predictionsCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Prediction[];
};

export const getLeaguePredictions = async (leagueId: string): Promise<Prediction[]> => {
  const q = query(
    predictionsCollection,
    where("leagueId", "==", leagueId),
    orderBy("points", "desc"),
    limit(100)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Prediction[];
};

// Real-time listeners
export const subscribeToLeaderboard = (
  leagueId: string | null,
  callback: (predictions: Prediction[]) => void
) => {
  let q;
  
  if (leagueId) {
    q = query(
      predictionsCollection,
      where("leagueId", "==", leagueId),
      orderBy("points", "desc"),
      limit(100)
    );
  } else {
    // Global leaderboard
    q = query(
      predictionsCollection,
      orderBy("points", "desc"),
      limit(100)
    );
  }

  return onSnapshot(q, (querySnapshot) => {
    const predictions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Prediction[];
    callback(predictions);
  });
}; 