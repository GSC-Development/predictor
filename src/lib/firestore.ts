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
  MatchResult,
  CreateUserData,
  CreateLeagueData,
  CreateFixtureData,
  CreatePredictionData,
  CreateMatchResultData 
} from "@/types";

// Collections references
export const usersCollection = collection(db, "users");
export const leaguesCollection = collection(db, "leagues");
export const fixturesCollection = collection(db, "fixtures");
export const predictionsCollection = collection(db, "predictions");
export const resultsCollection = collection(db, "results");

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
  // Temporary workaround: Get all upcoming fixtures, then filter by leagueType in memory
  const q = query(
    fixturesCollection,
    where("matchDate", ">", Timestamp.now()),
    orderBy("matchDate", "asc"),
    limit(100) // Increased limit to ensure we get SPL fixtures
  );

  const querySnapshot = await getDocs(q);
  let fixtures = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Fixture[];

  // Filter by leagueType in memory if specified
  if (leagueType) {
    fixtures = fixtures.filter(fixture => fixture.leagueType === leagueType);
  }

  // Return first 20 results
  return fixtures.slice(0, 20);
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
    where("userId", "==", userId)
  );

  const querySnapshot = await getDocs(q);
  const predictions = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Prediction[];
  
  // Sort in memory instead of requiring an index
  return predictions.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
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
      limit(500) // Increased limit and remove orderBy to avoid index requirement
    );
  } else {
    // Global leaderboard - get all predictions
    q = query(
      predictionsCollection,
      limit(500) // Remove orderBy to avoid index requirement
    );
  }

  return onSnapshot(q, (querySnapshot) => {
    const predictions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Prediction[];
    
    // Sort in memory by points descending
    const sortedPredictions = predictions.sort((a, b) => b.points - a.points);
    
    callback(sortedPredictions);
  });
};

// Match Result functions
export const createMatchResult = async (resultData: CreateMatchResultData): Promise<string> => {
  const docRef = await addDoc(resultsCollection, {
    ...resultData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getMatchResult = async (fixtureId: string): Promise<MatchResult | null> => {
  const q = query(resultsCollection, where("fixtureId", "==", fixtureId));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as MatchResult;
  }
  return null;
};

export const updateMatchResult = async (resultId: string, resultData: Partial<MatchResult>): Promise<void> => {
  const docRef = doc(db, "results", resultId);
  await updateDoc(docRef, {
    ...resultData,
    updatedAt: Timestamp.now()
  });
};

// Scoring functions
export const calculatePredictionPoints = (prediction: { homeScore: number, awayScore: number }, result: { homeScore: number, awayScore: number }): number => {
  // Exact score match = 5 points
  if (prediction.homeScore === result.homeScore && prediction.awayScore === result.awayScore) {
    return 5;
  }
  
  // Correct result (win/draw/loss) = 2 points
  const predictionResult = prediction.homeScore > prediction.awayScore ? 'home' : 
                          prediction.homeScore < prediction.awayScore ? 'away' : 'draw';
  const actualResult = result.homeScore > result.awayScore ? 'home' : 
                      result.homeScore < result.awayScore ? 'away' : 'draw';
  
  if (predictionResult === actualResult) {
    return 2;
  }
  
  // No points for wrong prediction
  return 0;
};

export const updatePredictionPoints = async (fixtureId: string, result: MatchResult): Promise<void> => {
  // Get all predictions for this fixture
  const q = query(predictionsCollection, where("fixtureId", "==", fixtureId));
  const querySnapshot = await getDocs(q);
  
  // Update points for each prediction
  const updatePromises = querySnapshot.docs.map(async (predictionDoc) => {
    const prediction = predictionDoc.data() as Prediction;
    const points = calculatePredictionPoints(
      { homeScore: prediction.homeScore, awayScore: prediction.awayScore },
      { homeScore: result.homeScore, awayScore: result.awayScore }
    );
    
    await updateDoc(predictionDoc.ref, { 
      points,
      updatedAt: Timestamp.now()
    });
  });
  
  await Promise.all(updatePromises);
};

// Get all results
export const getAllResults = async (): Promise<MatchResult[]> => {
  const querySnapshot = await getDocs(resultsCollection);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as MatchResult[];
}; 