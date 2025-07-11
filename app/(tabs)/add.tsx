// File: app/(tabs)/add.tsx

import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { uploadAudio, transcribeAudio, getTranscriptionResult } from '../../lib/assemblyai'; // Note the new path

export default function NewEntryScreen() {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('Press the mic to start speaking');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      setStatus('Recording...');
      setIsRecording(true);
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

    setStatus('Processing audio...');
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    const uri = recording.getURI();
    setRecording(null);

    if (uri) {
      handleTranscription(uri);
    }
  }

  async function handleTranscription(uri: string) {
    try {
      setStatus('Uploading audio...');
      const uploadUrl = await uploadAudio(uri);
      
      setStatus('Transcribing...');
      const transcriptId = await transcribeAudio(uploadUrl);
      
      const result = await getTranscriptionResult(transcriptId);
      
      setNote(prevNote => prevNote ? `${prevNote}\n${result}` : result);
      setStatus('Press the mic to start speaking');
    } catch (e) {
      console.error(e);
      setStatus('Transcription failed. Please try again.');
      Alert.alert('Error', 'Could not transcribe the audio.');
    }
  }

  const handleRecordButtonPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSave = () => {
    // In our next session, we'll implement saving this 'note' to device storage.
    console.log('Saving note:', note);
    Alert.alert('Note Saved!', 'Your journal entry has been saved.');
    setNote(''); // Clear the note for the next entry
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Start with a title or just start writing..."
        placeholderTextColor="#999"
        multiline
        style={styles.textInput}
      />
      <View style={styles.bottomBar}>
        <Text style={styles.statusText}>{status}</Text>
        <View style={styles.buttonsContainer}>
          <Pressable 
            style={[styles.recordButton, isRecording && styles.recordingButton]}
            onPress={handleRecordButtonPress}
          >
            <FontAwesome name={isRecording ? 'stop' : 'microphone'} size={24} color="white" />
          </Pressable>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    textAlignVertical: 'top',
    padding: 10,
  },
  bottomBar: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#eee'
  },
  statusText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#673ab7', // A nice purple
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#E91E63', // A pinkish-red for recording state
  },
  saveButton: {
    backgroundColor: '#4CAF50', // A calming green
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
