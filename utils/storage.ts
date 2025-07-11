import AsyncStorage from '@react-native-async-storage/async-storage';

export type JournalEntry = {
  id: string;
  date: string;
  audioUri: string;
  transcript: string;
  summary: string;
};

const HISTORY_KEY = 'echomind-history';

export async function saveJournalEntry(entry: JournalEntry) {
  const history = await getJournalEntries();
  history.unshift(entry); // newest first
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const data = await AsyncStorage.getItem(HISTORY_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function clearJournalHistory() {
  await AsyncStorage.removeItem(HISTORY_KEY);
}
