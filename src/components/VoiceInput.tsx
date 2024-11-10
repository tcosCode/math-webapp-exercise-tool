import { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

export default function VoiceInput({
  value,
  onChange,
  placeholder,
  className,
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "es-ES";
      }

      // Handle speech recognition events
      recognitionRef.current!.onresult = (event: SpeechRecognitionEvent) => {
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

      // Handle speech recognition errors
      recognitionRef.current!.onerror = (
        event: SpeechRecognitionErrorEvent
      ) => {
        console.error("Speech recognition error:", event.error, event.message);
        stopListening();
      };

      // Wait for 3 seconds before stopping on speech end
      recognitionRef.current!.onspeechend = () => {
        setTimeout(() => {
          stopListening();
        }, 2000); // Wait for 2 seconds before stopping
      };

      // Stop listening when speech recognition ends
      recognitionRef.current!.onend = () => {
        stopListening();
      };
    }

    // Cleanup
    return () => {
      console.log("Cleanup");
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onChange, value]);

  // Start listening
  const startListening = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognitionRef.current!.start();
      setIsListening(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to use voice input.");
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Toggle listening
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
