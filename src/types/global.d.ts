interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  replacements?: ReplacementRule[];
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResult[];
  length: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
  grammars: SpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;
  onaudiostart: (this: SpeechRecognition, ev: Event) => void;
  onsoundstart: (this: SpeechRecognition, ev: Event) => void;
  onspeechstart: (this: SpeechRecognition, ev: Event) => void;
  onspeechend: (this: SpeechRecognition, ev: Event) => void;
  onsoundend: (this: SpeechRecognition, ev: Event) => void;
  onaudioend: (this: SpeechRecognition, ev: Event) => void;
  onresult: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => void;
  onnomatch: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => void;
  onerror: (this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void;
  onstart: (this: SpeechRecognition, ev: Event) => void;
  onend: (this: SpeechRecognition, ev: Event) => void;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechGrammarList {
  length: number;
  item(index: number): SpeechGrammar;
  addFromURI(src: string, weight?: number): void;
  addFromString(string: string, weight?: number): void;
}

interface SpeechGrammar {
  src: string;
  weight: number;
}

interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}
