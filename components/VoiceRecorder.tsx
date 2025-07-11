import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { Card, Button, Text, ActivityIndicator, Divider, useTheme, IconButton } from 'react-native-paper';
import { summarizeWithOpenAI } from '../utils/openai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { ASSEMBLYAI_API_KEY, OPENAI_API_KEY } from '@env';

// Type for journal entry
type JournalEntry = {
  id: string;
  date: string;
  audioUri: string;
  transcript: string;
  summary: string;
};

const HISTORY_KEY = 'echomind-history';

async function saveJournalEntry(entry: JournalEntry) {
  const data = await AsyncStorage.getItem(HISTORY_KEY);
  let history: JournalEntry[] = [];
  if (data) {
    try {
      history = JSON.parse(data);
    } catch {}
  }
  history.unshift(entry); // newest first
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export default function VoiceRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);

  const theme = useTheme();
  const recordTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);

      // Auto-stop after 15 seconds
      recordTimeout.current = setTimeout(() => {
        if (isRecording) stopRecording();
      }, 15000);
    } catch (err) {
      Alert.alert('Failed to start recording', String(err));
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (recordTimeout.current) clearTimeout(recordTimeout.current);
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordedUri(uri || null);
    setRecording(null);
  };

  const playRecording = async () => {
    if (!recordedUri) return;
    const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
    setSound(sound);
    await sound.playAsync();
  };

  // Dummy transcribe function for demo; replace with your real transcription logic!
  const handleTranscribe = async () => {
    if (!recordedUri) {
      Alert.alert('Please record audio first.');
      return;
    }
    setTranscript('This is a dummy transcript. Replace with real transcription logic.');
  };

  const handleSummarize = async () => {
    if (!transcript) {
      Alert.alert('Please transcribe audio first.');
      return;
    }
    setSummarizing(true);
    try {
      const result = await summarizeWithOpenAI(transcript);
      setSummary(result);
      // Save entry to history only if recordedUri exists
      if (recordedUri) {
        const entry: JournalEntry = {
          id: uuidv4(),
          date: new Date().toISOString(),
          audioUri: recordedUri,
          transcript,
          summary: result,
        };
        await saveJournalEntry(entry);
      }
    } catch (err: any) {
      setSummary('Summarization failed: ' + (err.response?.data?.error?.message || err.message));
    }
    setSummarizing(false);
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card} mode="elevated">
        <Card.Title
          title="EchoMind Voice Journal"
          left={props => (
            <IconButton
              {...props}
              icon="microphone"
              theme={{ colors: { primary: theme.colors.primary || '#6C63FF' } }}
            />
          )}
        />
        <Card.Content>
          <Button
            mode={isRecording ? "contained-tonal" : "contained"}
            icon={isRecording ? "stop" : "record-rec"}
            onPress={isRecording ? stopRecording : startRecording}
            buttonColor={isRecording ? theme.colors.error : theme.colors.primary}
            style={styles.actionButton}
            labelStyle={{ fontSize: 18, color: '#fff' }}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
          <Text style={styles.helperText}>
            {isRecording ? 'Recording (max 15s)...' : 'Tap to start a new recording (max 15s)'}
          </Text>
          <Divider style={{ marginVertical: 16 }} />
          {recordedUri && (
            <View style={{ marginBottom: 16 }}>
              <Button
                mode="outlined"
                icon="play"
                onPress={playRecording}
                style={styles.secondaryButton}
                labelStyle={{ color: theme.colors.primary }}
              >
                Play Recording
              </Button>
              <Button
                mode="outlined"
                icon="text"
                onPress={handleTranscribe}
                style={styles.secondaryButton}
                labelStyle={{ color: theme.colors.primary }}
              >
                Transcribe
              </Button>
              <Text style={styles.uri}>{recordedUri}</Text>
            </View>
          )}
          {transcript ? (
            <View>
              <Text style={styles.transcriptTitle}>Transcript</Text>
              <Text style={styles.transcript}>{transcript}</Text>
              <Button
                mode="contained"
                icon="robot"
                onPress={handleSummarize}
                disabled={summarizing}
                style={styles.actionButton}
                labelStyle={{ color: '#fff' }}
              >
                Summarize with AI
              </Button>
            </View>
          ) : null}
          {summarizing && (
            <ActivityIndicator
              animating
              size="large"
              color={theme.colors.primary}
              style={{ marginTop: 16 }}
            />
          )}
          {summary ? (
            <Card style={styles.summaryCard} mode="outlined">
              <Card.Title
                title="AI Journal Summary"
                left={props => (
                  <IconButton
                    {...props}
                    icon="lightbulb-on"
                    theme={{ colors: { primary: theme.colors.secondary || '#FFD600' } }}
                  />
                )}
              />
              <Card.Content>
                <Text style={styles.summaryText}>{summary}</Text>
              </Card.Content>
            </Card>
          ) : null}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 40, paddingHorizontal: 16, backgroundColor: '#f5f6fa' },
  card: { borderRadius: 20, padding: 8 },
  actionButton: { marginVertical: 10 },
  secondaryButton: { marginVertical: 6 },
  helperText: { color: '#888', marginTop: 8, fontSize: 12 },
  uri: { fontSize: 10, color: '#888', marginTop: 10 },
  transcriptTitle: { marginTop: 8, marginBottom: 4, fontWeight: 'bold', color: '#222', fontSize: 16 },
  transcript: { marginBottom: 12, color: '#222' },
  summaryCard: { marginTop: 20, borderRadius: 16, backgroundColor: '#e6f0ff' },
  summaryText: { color: '#222' },
});
