import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import CustomDropdown from './CustomDropdown';
import { text } from 'stream/consumers';

const TomatoTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [timerName, setTimerName] = useState('Tomato Timer');
  const [selectedTime, setSelectedTime] = useState(25 * 60);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(25 * 60); // Default to 25 minutes
  const [timerEndMessageVisible, setTimerEndMessageVisible] = useState(false); // New state for full-screen message

  useEffect(() => {
    let interval;

    const handleInterval = () => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          showTimerEndMessage();
          setIsActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    };

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(handleInterval, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft, timerName]);

  const showTimerEndMessage = async () => {
    setTimerEndMessageVisible(true);
    await scheduleNotification();
  };

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${timerName} Time is up!`,
        body: `${timerName} has finished.`,
      },
      trigger: null,
    });
  };

  const startTimer = async () => {
    await Notifications.requestPermissionsAsync();
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const restartTimer = () => {
    setIsPaused(false);
  };

  const stopTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedTime);
    setIsPaused(false);
  };

  const handleSave = () => {
    setTimeLeft(selectedTime);
    setModalVisible(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const durations = [
    { label: '5 minutes', value: 5 * 60 , text:'Short Break'},
    { label: '15 minutes', value: 15 * 60, text:'Long Break'},
    { label: '25 minutes', value: 25 * 60, text:'Tomato'},
    { label: '1 minute', value: 1 * 60, text:'Short'},
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <ThemedText type='title' style={styles.headerText}>{timerName}</ThemedText>
        <Ionicons name="create-outline" size={26} color="white" onPress={() => setModalVisible(true)} />
      </View>
      <Text style={styles.timerText2}>{selectedDuration.text}</Text>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>

      {!isActive && !isPaused ? (
        <TouchableOpacity style={styles.startButton} onPress={startTimer}>
          <Ionicons name="timer-outline" size={30} color="black" style={styles.icon} />
          <Text style={styles.startButtonText}>Start Timer</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.buttonsContainer}>
          {isPaused ? (
            <>
              <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopTimer}>
                <Text style={styles.buttonText}>Stop</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.startPauseButton]} onPress={restartTimer}>
                <Ionicons name="play" size={35} color={'white'} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopTimer}>
                <Text style={styles.buttonText}>Stop</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.startPauseButton]} onPress={pauseTimer}>
                <Ionicons name="pause" size={35} color={'white'} />
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalView}>
          <TextInput
            placeholder="Timer Name"
            value={timerName}
            onChangeText={setTimerName}
            style={styles.input}
          />
       <CustomDropdown
            value={selectedDuration.value}
            options={durations}
            onSelect={(value) => {
              setSelectedDuration(value);
              setSelectedTime(value);
              const selected = durations.find((duration) => duration.value === value);
              setSelectedDuration(selected);
            }}
          />
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={{ fontSize: 19 }}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {timerEndMessageVisible && (
        <View style={styles.endModal}>
          <Text style={{fontSize:19, fontWeight:'700',marginBottom:15}}>{`${timerName} time is up!`}</Text>
          <TouchableOpacity
           style={styles.saveButton}
            onPress={() => setTimerEndMessageVisible(false)}
          >
            <Text style={{ fontSize: 16 }}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TomatoTimer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    marginRight: 10,
    fontSize: 26,
  },
  timerText: {
    color: 'white',
    fontSize: 90,
    fontWeight: 'bold',
  },
  timerText2: {
    color: 'grey',
    top:492,
    left:-362,
    position:'absolute',
    transform: [{ rotate: '90deg'}],
    fontSize: 80,
    width:'200%',
    letterSpacing: 6,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 70,
    width: '100%',
    justifyContent: 'space-around',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: 'red',
    padding:9,
    borderRadius: 25,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startPauseButton: {
    backgroundColor: '#66666e',
  },
  stopButton: {
    backgroundColor: '#800f2f',
  },
  buttonText: {
    color: '#c9184a',
    fontSize: 22,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  modalView: {
    margin: 20,
    marginLeft:50,
    marginRight:50,
    top:290,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  endModal: {
    margin: 20,
    marginLeft:50,
    marginRight:50,
    top:-100,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 50,
    fontSize:20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius:15,
    marginBottom: 15,
    width: 200,
    textAlign: 'center',
  },
  timeInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    color: 'black',
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: 'white',
    padding: 7,
    paddingLeft:15,
    paddingRight:15,
    top:15,
    color:'white',
    borderWidth:1,
    borderColor:'black',
    borderRadius: 10,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    marginTop: 20,
  },
  startButtonText: {
    color: 'black',
    fontSize: 17,
    fontWeight:'600',
    marginLeft: 10,
  },
  icon: {
    marginRight:-2,
  },
});