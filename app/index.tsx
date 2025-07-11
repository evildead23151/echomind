import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Provider as PaperProvider, Title, Paragraph, Card, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import VoiceRecorder from '../components/VoiceRecorder';

export default function HomeScreen() {
  return (
    <PaperProvider>
      <LinearGradient colors={['#23243a', '#181c2f']} style={styles.background}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
              <MaterialCommunityIcons name="microphone" size={40} color="#6C63FF" />
              <Title style={styles.title}>EchoMind</Title>
              <Paragraph style={styles.subtitle}>Voice-first journaling. Tap to record your thoughts.</Paragraph>
            </View>

            <Card style={styles.card}>
              <Card.Content>
                <VoiceRecorder />
              </Card.Content>
            </Card>

            <Card style={[styles.card, { backgroundColor: '#23243a' }]}>
              <Card.Content style={styles.statsRow}>
                <View>
                  <Title style={{ color: '#fff' }}>Streak: 5 days</Title>
                  <Paragraph style={{ color: '#b0b5d8' }}>Keep journaling daily!</Paragraph>
                </View>
                <Ionicons name="flame" size={32} color="#FFD700" />
              </Card.Content>
            </Card>

            <View style={styles.navRow}>
              <Button
                mode="contained"
                icon="book-open-page-variant"
                color="#6C63FF"
                style={styles.navButton}
                labelStyle={{ color: '#fff' }}
                onPress={() => {/* navigate to history */}}
              >
                History
              </Button>
              <Button
                mode="contained"
                icon="chart-bar"
                color="#6C63FF"
                style={styles.navButton}
                labelStyle={{ color: '#fff' }}
                onPress={() => {/* navigate to analytics */}}
              >
                Analytics
              </Button>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { alignItems: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 24 },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 8 },
  subtitle: { color: '#b0b5d8', fontSize: 16, textAlign: 'center', marginTop: 4 },
  card: {
    width: '100%',
    backgroundColor: '#23243a',
    borderRadius: 24,
    marginBottom: 20,
    padding: 8,
    elevation: 6,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 16 },
  navButton: { flex: 1, marginHorizontal: 8, borderRadius: 16, elevation: 2 },
});
