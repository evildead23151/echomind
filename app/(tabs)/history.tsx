import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, Divider, ActivityIndicator } from 'react-native-paper';
import { getJournalEntries, clearJournalHistory, JournalEntry } from '../../utils/storage';

export default function HistoryScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEntries = async () => {
    setLoading(true);
    const data = await getJournalEntries();
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  };

  const handleClear = async () => {
    await clearJournalHistory();
    await loadEntries();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!entries.length) {
    return (
      <View style={styles.centered}>
        <Text>No journal entries yet. Start recording!</Text>
        <Button mode="outlined" onPress={onRefresh} style={{ marginTop: 16 }}>
          Refresh
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={handleClear} style={{ marginBottom: 16 }}>
        Clear History
      </Button>
      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <Card style={styles.card} mode="outlined">
            <Card.Title title={new Date(item.date).toLocaleString()} />
            <Card.Content>
              <Text style={styles.label}>Transcript:</Text>
              <Text>{item.transcript}</Text>
              <Divider style={{ marginVertical: 8 }} />
              <Text style={styles.label}>AI Summary:</Text>
              <Text>{item.summary}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f6fa' },
  card: { marginBottom: 16, borderRadius: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f6fa' },
  label: { fontWeight: 'bold', marginBottom: 4 },
});
