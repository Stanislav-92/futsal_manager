import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/providers/firebase';
import type { PlayerContact } from '../types/player.types';

const playersCollection = collection(db, 'players');

export const getPlayers = async (): Promise<PlayerContact[]> => {
  const snapshot = await getDocs(playersCollection);
  const players = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as PlayerContact[];

  return players.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
};

export const addPlayer = async (player: Omit<PlayerContact, 'id'>): Promise<PlayerContact> => {
  const emailQuery = query(playersCollection, where('email', '==', player.email));
  const existingEmail = await getDocs(emailQuery);

  if (!existingEmail.empty) {
    throw new Error('Player with this email already exists');
  }

  const docRef = await addDoc(playersCollection, player);
  return { id: docRef.id, ...player };
};

export const updatePlayer = async (
  id: string,
  data: Omit<PlayerContact, 'id'>,
): Promise<PlayerContact> => {
  await updateDoc(doc(playersCollection, id), data);
  return { id, ...data };
};

export const deletePlayer = async (id: string): Promise<void> => {
  await deleteDoc(doc(playersCollection, id));
};
