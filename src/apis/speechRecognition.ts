
import { useEffect, useRef, useState } from "react";
import { useWhisper } from '@chengsokdara/use-whisper'

interface SpeechFoundCallback {
  (text: string): void;
}

export enum CharacterState {
  Idle,
  Listening,
  Speaking,
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const useSpeechRecognition = () => {
  const [characterState, setCharacterState] = useState<CharacterState>(
    CharacterState.Idle
  );
  const [noMoreTalk, setMoreTalk] = useState(false)
  const onSpeechFoundCallback = useRef<SpeechFoundCallback>((text) => {});
  const bars = useRef<(HTMLDivElement | null)[]>([]);
  

  const [conversationStarted, setConversationStarted] = useState(false)

  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        
  })

  useEffect(() => {
    if(speaking){
      setConversationStarted(true)
    }
  },[speaking])


  useEffect(() => {
    if(conversationStarted && !speaking){
      stopRecording() 
    }
  },[conversationStarted, speaking])


  const setOnSpeechFoundCallback = (callback: SpeechFoundCallback) => {
    onSpeechFoundCallback.current = callback;
  };


  useEffect(() => {
    if(transcript && transcript.text){
      console.log(transcript.text)
      onSpeechFoundCallback.current(transcript.text);
      startRecording()
    }
  },[transcript])


  useEffect(() => {
    if(noMoreTalk){
      setCharacterState(CharacterState.Idle);
      stopRecording();
    }

  },[noMoreTalk])


  const onMicButtonPressed = async() => {
    if (characterState === CharacterState.Idle) {
      startRecording()
      setCharacterState(CharacterState.Listening);
      setMoreTalk(false)
    } else if (characterState === CharacterState.Listening) {
      setMoreTalk(true)
    }
  };

  return {
    characterState,
    bars,
    setCharacterState,
    onMicButtonPressed,
    setOnSpeechFoundCallback,
  };
};

export default useSpeechRecognition; 