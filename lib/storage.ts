import * as SecureStore from 'expo-secure-store';
import type { CycleEntry } from './types';

const STORAGE_KEY = 'femmmy_cycles';

export async function loadCycles(): Promise<CycleEntry[]> {
  try {
    const json = await SecureStore.getItemAsync(STORAGE_KEY);
    if (json) {
      return JSON.parse(json) as CycleEntry[];
    }
    return [];
  } catch {
    return [];
  }
}

export async function saveCycles(cycles: CycleEntry[]): Promise<void> {
  try {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(cycles));
  } catch (error) {
    console.error('Failed to save cycles:', error);
  }
}

export async function clearCycles(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cycles:', error);
  }
}