import { Plus, Trash2 } from "lucide-react";
import VoiceInput from "./VoiceInput";
import { mathReplacements } from "../utils/replacements";
import { MatchingData, MatchingInciso } from "../types/json-types";

interface MatchingFormProps {
  data: MatchingData;
  onChange: (data: MatchingData) => void;
}

function MatchingForm({ data, onChange }: MatchingFormProps) {
  const addPair = (withMatch = true) => {
    const nextPairId = Math.max(0, ...data.incisos.map((i) => i.pairId)) + 1;
    const newIncisos = withMatch
      ? [
          ...data.incisos,
          {
            text: "<strong>Pregunta:</strong> " + "",
            pairId: nextPairId,
          },
          {
            text: "Respuesta: " + "",
            pairId: nextPairId,
          },
        ]
      : [
          ...data.incisos,
          {
            text: "Respuesta: " + "",
            pairId: nextPairId,
          },
        ];

    onChange({
      ...data,
      incisos: newIncisos,
    });
  };

  const removePair = (pairId: number) => {
    const newIncisos = data.incisos.filter(
      (inciso) => inciso.pairId !== pairId
    );
    onChange({ ...data, incisos: newIncisos });
  };

  const updateInciso = (index: number, text: string) => {
    const newIncisos = [...data.incisos];
    const isQuestion = newIncisos[index].text.includes("Pregunta");
    const prefix = isQuestion ? "<strong>Pregunta:</strong> " : "Respuesta: ";
    newIncisos[index] = { ...newIncisos[index], text: prefix + text };
    onChange({ ...data, incisos: newIncisos });
  };

  const getPairs = () => {
    const pairs: { question: MatchingInciso; answer: MatchingInciso }[] = [];
    const questions = data.incisos.filter((i) => i.text.includes("Pregunta"));
    const answers = data.incisos.filter((i) => i.text.includes("Respuesta"));

    // First, create pairs for matching questions and answers
    questions.forEach((question) => {
      const matchingAnswer = answers.find((a) => a.pairId === question.pairId);
      if (matchingAnswer) {
        pairs.push({ question, answer: matchingAnswer });
      }
    });

    // Then add remaining answers as pairs without questions
    const unmatchedAnswers = answers.filter(
      (answer) => !questions.some((q) => q.pairId === answer.pairId)
    );
    unmatchedAnswers.forEach((answer) => {
      pairs.push({
        question: { text: "", pairId: answer.pairId },
        answer,
      });
    });

    return pairs.sort((a, b) => a.question.pairId - b.question.pairId);
  };

  const getInputValue = (text: string) => {
    if (text.includes("Pregunta")) {
      return text.replace("<strong>Pregunta:</strong> ", "");
    }
    return text.replace("Respuesta: ", "");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <VoiceInput
            inputType="input"
            value={data.title}
            onChange={(value) => onChange({ ...data, title: value })}
            replacements={mathReplacements}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Enunciado del Ejercicio
          </label>
          <VoiceInput
            inputType="textarea"
            value={data.texto}
            onChange={(value) => onChange({ ...data, texto: value })}
            replacements={mathReplacements}
            rows={5}
            placeholder="Puedes usar HTML para dar formato al texto"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Parejas</h3>
          <div className="flex gap-2">
            <button
              onClick={() => addPair(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Añadir Pareja
            </button>
            <button
              onClick={() => addPair(false)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Añadir Respuesta Extra
            </button>
          </div>
        </div>

        {getPairs().map(({ question, answer }, index) => (
          <div
            key={answer.pairId}
            className="space-y-3 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                {index + 1}
              </span>
              <button
                onClick={() => removePair(answer.pairId)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            {question.text && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pregunta
                </label>
                <VoiceInput
                  inputType="textarea"
                  value={getInputValue(question.text)}
                  onChange={(value) =>
                    updateInciso(data.incisos.indexOf(question), value)
                  }
                  replacements={mathReplacements}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  placeholder="Escribe tu pregunta aquí"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Respuesta
              </label>
              <VoiceInput
                inputType="textarea"
                value={getInputValue(answer.text)}
                onChange={(value) =>
                  updateInciso(data.incisos.indexOf(answer), value)
                }
                replacements={mathReplacements}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                placeholder="Escribe la respuesta aquí"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchingForm;
