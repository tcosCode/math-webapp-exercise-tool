import { useCallback, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { ReplacementRule, applyReplacements } from "../utils/replacements";
import TextInputCustom from "./TextInputCustom";
import TextAreaCustom from "./TextAreaCustom";

interface VoiceInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  replacements?: ReplacementRule[];
  inputType?: "input" | "textarea";
  rows?: number;
}

export default function VoiceInput({
  id,
  value,
  onChange,
  placeholder,
  className,
  replacements = [],
  inputType,
  rows,
}: VoiceInputProps) {
  const activeInputRef = useRef<string | null>(null);

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    //isMicrophoneAvailable,
    resetTranscript,
  } = useSpeechRecognition({
    transcribing: activeInputRef.current === id,
  });

  //Handle the result of the speech recognition
  const handleResult = useCallback(() => {
    if (transcript && activeInputRef.current === id) {
      const processedText = applyReplacements(transcript, replacements);
      onChange(value + " " + processedText.trim().toLowerCase());
      resetTranscript();
    }
  }, [transcript, value, onChange, replacements, resetTranscript, id]);

  // UseEffect to handle the result of the speech recognition
  useEffect(() => {
    if (!listening && activeInputRef.current === id) {
      handleResult();
      activeInputRef.current = null;
    }
  }, [listening, handleResult, id]);

  // Start listening
  const startListening = async () => {
    try {
      // Stop any existing recognition
      if (listening) {
        await SpeechRecognition.stopListening();
      }

      // Set this input as active
      activeInputRef.current = id;
      resetTranscript();

      await SpeechRecognition.startListening({
        continuous: true,
        language: "es-ES",
      });
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      alert(
        "Por favor, permite el acceso al micrófono para usar el reconocimiento de voz."
      );
    }
  };

  // Stop listening
  const stopListening = () => {
    if (activeInputRef.current === id) {
      SpeechRecognition.stopListening();
    }
  };

  // Toggle listening
  const toggleListening = async () => {
    if (!browserSupportsSpeechRecognition) {
      return;
    }

    if (listening && activeInputRef.current === id) {
      stopListening();
    } else {
      await startListening();
    }
  };

  const isActiveInput = activeInputRef.current === id;

  return (
    <div>
      <div className="relative">
        {inputType === "input" ? (
          <TextInputCustom
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            replacements={replacements}
            className={className}
          />
        ) : (
          <TextAreaCustom
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            replacements={replacements}
            className={className}
            rows={rows}
          />
        )}
        <button
          type="button"
          onClick={toggleListening}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors
          ${
            listening && isActiveInput
              ? "text-red-500 hover:text-red-600 bg-red-50"
              : "text-gray-400 hover:text-gray-500 hover:bg-gray-50"
          }`}
        >
          {listening && isActiveInput ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </button>
      </div>
      {listening && isActiveInput && transcript && (
        <div className="text-sm text-gray-500 italic mt-1">
          <strong>Escuchando:</strong> {transcript}
        </div>
      )}
    </div>
  );
}
