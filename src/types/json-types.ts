export type JsonType =
  | "TrueFalse"
  | "ChooseAnswer"
  | "Matching"
  | "FillBlank"
  | "Problem";
export type Validation = "true" | "false" | "correct" | "incorrect";

export interface TrueFalseInciso {
  id: string;
  exercise: string;
  validation: "true" | "false";
}

export interface TrueFalseData {
  id: string;
  type: "TrueFalse";
  title: string;
  texto: string;
  incisos: TrueFalseInciso[];
}

export interface ChooseAnswerOption {
  text: string;
  validation: "correct" | "incorrect";
}

export interface ChooseAnswerInciso {
  id: string;
  exercise: string;
  answer: ChooseAnswerOption[];
}

export interface ChooseAnswerData {
  id: string;
  type: "ChooseAnswer";
  title: string;
  texto: string;
  incisos: ChooseAnswerInciso[];
}

export interface MatchingInciso {
  text: string;
  pairId: number;
}

export interface MatchingData {
  id: string;
  type: "Matching";
  title: string;
  texto: string;
  incisos: MatchingInciso[];
}

export interface ProblemInciso {
  id: string;
  exercise: string;
  answer: string;
}

export interface ProblemData {
  id: string;
  type: "Problem";
  title: string;
  texto: string;
  incisos: ProblemInciso[];
}

export interface FillBlankOption {
  id: string;
  text: string;
  position: string;
}

export interface FillBlankInciso {
  id: string;
  sentence: string[];
  options: FillBlankOption[];
}

export interface FillBlankData {
  id: string;
  type: "FillBlank";
  title: string;
  texto: string;
  incisos: FillBlankInciso[];
}

export type JsonData =
  | TrueFalseData
  | ChooseAnswerData
  | MatchingData
  | ProblemData
  | FillBlankData;
