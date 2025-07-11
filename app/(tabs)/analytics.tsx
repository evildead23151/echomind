import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { getJournalEntries, JournalEntry } from '../../utils/storage';

export default function AnalyticsScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJournalEntries().then(data => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  const total = entries.length;
  const words = entries.reduce(
    (acc, e) => acc + (e.transcript ? e.transcript.split(' ').length : 0),
    0
  );
  const lastEntry =
    entries[0]?.date ? new Date(entries[0].date).toLocaleString() : 'N/A';

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Analytics" />
        <Card.Content>
          <Text>Total Entries: {total}</Text>
          <Text>Total Words Spoken: {words}</Text>
          <Text>Last Entry: {lastEntry}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f6fa' },
  card: { width: '90%', borderRadius: 16 },
});
