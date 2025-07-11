// File: app/(tabs)/index.tsx

import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { uploadAudio, transcribeAudio, getTranscriptionResult } from '../../lib/assemblyai';

export default function HomeScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [status, setStatus] = useState('Tap to start a new recording');
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
      // Reset states for a new recording
      setRecordingUri(null);
      setTranscript('');
      setStatus('Recording...');
      setIsRecording(true);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);

    } catch (err) {
      console.error('Failed to start recording', err);
      setStatus('Failed to start recording');
      setIsRecording(false);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    setStatus('Recording stopped. Ready to transcribe.');
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordingUri(uri);
    setRecording(null);
    console.log('Recording stopped and stored at', uri);
  }

  async function handleTranscription() {
    if (!recordingUri) {
      Alert.alert('No Recording', 'Please record some audio first.');
      return;
    }

    setIsLoading(true);
    setStatus('Transcribing...');
    setTranscript('');

    try {
      const uploadUrl = await uploadAudio(recordingUri);
      const transcriptId = await transcribeAudio(uploadUrl);
      const result = await getTranscriptionResult(transcriptId);
      setTranscript(result);
      setStatus('Transcription successful!');
    } catch (e) {
      console.error(e);
      setStatus('Transcription failed. Please try again.');
      Alert.alert('Error', 'Could not get the transcription.');
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleRecordButtonPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <View style={styles.header}>
          <Ionicons name="mic-outline" size={30} color="#C9B3FF" />
          <Text style={styles.headerTitle}>EchoMind</Text>
          <Text style={styles.headerSubtitle}>Voice-first journaling. Tap to record your thoughts.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="journal-outline" size={24} color="#333" />
            <Text style={styles.cardTitle}>EchoMind Voice Journal</Text>
          </View>

          <Pressable
            style={[styles.primaryButton, isRecording && styles.recordingButton]}
            onPress={handleRecordButtonPress}
            disabled={isLoading && !isRecording}
          >
            <Text style={styles.primaryButtonText}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
          </Pressable>
          <Text style={styles.statusText}>{status}</Text>

          <View style={styles.divider} />
          
          <Pressable
            style={[styles.secondaryButton, (!recordingUri || isRecording) && styles.disabledButton]}
            onPress={handleTranscription}
            disabled={!recordingUri || isLoading || isRecording}
          >
            <Text style={styles.secondaryButtonText}>Transcribe</Text>
          </Pressable>

          {isLoading && !isRecording && <ActivityIndicator size="large" color="#8A2BE2" style={{ marginVertical: 20 }} />}
          
          {transcript ? (
            <View style={styles.transcriptContainer}>
              <Text style={styles.transcriptTitle}>Transcription Result</Text>
              <Text style={styles.transcriptText}>{transcript}</Text>
            </View>
          ) : null}
        </View>
        
        <View style={styles.streakCard}>
            <Ionicons name="flame" size={24} color="#FFD700" />
            <View>
              <Text style={styles.streakTitle}>Streak: 1 day</Text>
              <Text style={styles.streakSubtitle}>Keep journaling daily!</Text>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1B22',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#A9A9A9',
    marginTop: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  primaryButton: {
    backgroundColor: '#C9B3FF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#FF6347',
  },
  primaryButtonText: {
    color: '#1C1B22',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#666',
    marginTop: 10,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    width: '100%',
    marginVertical: 20,
  },
  secondaryButton: {
    borderColor: '#C9B3FF',
    borderWidth: 2,
    paddingVertical: 15,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#8A2BE2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    borderColor: '#D3D3D3',
    backgroundColor: '#F5F5F5'
  },
  transcriptContainer: {
    backgroundColor: '#F0EFFF',
    borderRadius: 15,
    padding: 15,
    width: '100%',
    marginTop: 20,
  },
  transcriptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  transcriptText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2931',
    borderRadius: 15,
    padding: 15,
    width: '90%',
    marginTop: 20,
    marginBottom: 20,
  },
  streakTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  streakSubtitle: {
    color: '#A9A9A9',
    fontSize: 12,
    marginLeft: 15,
  },
});
