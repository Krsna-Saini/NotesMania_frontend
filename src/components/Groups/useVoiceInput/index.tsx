/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";

// Add type declarations for SpeechRecognition
type SpeechRecognition = typeof window.SpeechRecognition extends undefined
  ? typeof window.webkitSpeechRecognition
  : typeof window.SpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<InstanceType<SpeechRecognition> | null>(null);

  // Start voice recognition
  const startListening = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false; // Stops listening after a pause
    recognition.lang = "en-US"; // Set language
    recognition.interimResults = false; // Only final results
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      setTranscript(event.results[0][0].transcript);
    };

    recognition.onerror = (event:any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  // Stop voice recognition
  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return { transcript, isListening, startListening, stopListening };
};

export default useVoiceInput;
