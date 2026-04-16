import { db } from '@/providers/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import type { Match } from '../types/match.types';

const matchesCollection = collection(db, 'matches');

export const getMatches = async (): Promise<Match[]> => {
  const matchQuery = query(matchesCollection, orderBy('date', 'desc'));
  const snapshot = await getDocs(matchQuery);
  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Match[];
};

export const addMatch = async (match: Omit<Match, 'id'>): Promise<Match> => {
  const docRef = await addDoc(matchesCollection, match);
  return { id: docRef.id, ...match };
};

export const updateMatch = async (id: string, data: Partial<Omit<Match, 'id'>>): Promise<void> => {
  await updateDoc(doc(matchesCollection, id), data);
};

export const deleteMatch = async (id: string): Promise<void> => {
  await deleteDoc(doc(matchesCollection, id));
};
