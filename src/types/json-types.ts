export type JsonType =
  | "TRUEFALSE"
  | "CHOOSEANSWER"
  | "MATCHING"
  | "FILLBLANK"
  | "PROBLEM";
export type Validation =
  | "VALIDATE_TRUE"
  | "VALIDATE_FALSE"
  | "CORRECT"
  | "INCORRECT";

export interface TrueFalseInciso {
  id: string;
  exercise: string;
  validation: "VALIDATE_TRUE" | "VALIDATE_FALSE";
}

export interface TrueFalseData {
  id: string;
  type: "TRUEFALSE";
  title: string;
  texto: string;
  incisos: TrueFalseInciso[];
}

export interface ChooseAnswerOption {
  text: string;
  validation: "CORRECT" | "INCORRECT";
}

export interface ChooseAnswerInciso {
  id: string;
  exercise: string;
  answer: ChooseAnswerOption[];
}

export interface ChooseAnswerData {
  id: string;
  type: "CHOOSEANSWER";
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
  type: "MATCHING";
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
  type: "PROBLEM";
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
  type: "FILLBLANK";
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
