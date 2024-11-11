import { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const createRecognition = () => {
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "es-ES";
    return recognition;
  }
  return null;
};

export default function VoiceInput({
  value,
  onChange,
  placeholder,
  className,
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize recognition instance once
  useEffect(() => {
    recognitionRef.current = createRecognition();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      // Ensure we clean up the media stream on unmount
      if (mediaStreamRef.current) {
        stopMediaTracks();
      }
    };
  }, []);

  const stopMediaTracks = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }
  };

  // Set up event listeners separately
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    const handleResult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onChange(value + " " + finalTranscript.trim());
      }
    };

    const handleError = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error, event.message);
      stopListening();
    };

    const handleSpeechEnd = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 2000);
    };

    const handleEnd = () => {
      setIsListening(false);
      stopMediaTracks();
    };

    recognition.addEventListener(
      "result",
      handleResult as unknown as EventListener
    );
    recognition.addEventListener(
      "error",
      handleError as unknown as EventListener
    );
    recognition.addEventListener(
      "speechend",
      handleSpeechEnd as unknown as EventListener
    );
    recognition.addEventListener("end", handleEnd as unknown as EventListener);

    return () => {
      recognition.removeEventListener(
        "result",
        handleResult as unknown as EventListener
      );
      recognition.removeEventListener(
        "error",
        handleError as unknown as EventListener
      );
      recognition.removeEventListener("speechend", handleSpeechEnd);
      recognition.removeEventListener("end", handleEnd);
    };
  }, [onChange, value]);

  const startListening = async () => {
    try {
      // Get media stream and store it
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to use voice input.");
    }
  };

  const stopListening = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    stopMediaTracks();
    setIsListening(false);
  };

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${className} pr-10`}
      />
      <button
        type="button"
        onClick={toggleListening}
        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors
          ${
            isListening
              ? "text-red-500 hover:text-red-600 bg-red-50"
              : "text-gray-400 hover:text-gray-500 hover:bg-gray-50"
          }`}
      >
        {isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
