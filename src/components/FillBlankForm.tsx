import { Plus, Trash2 } from "lucide-react";
import VoiceInput from "./VoiceInput";
import { mathReplacements } from "../utils/replacements";
import {
  FillBlankData,
  FillBlankInciso,
  FillBlankOption,
} from "../types/json-types";

interface FillBlankFormProps {
  data: FillBlankData;
  onChange: (data: FillBlankData) => void;
}

function FillBlankForm({ data, onChange }: FillBlankFormProps) {
  const addInciso = () => {
    const incisoId = String.fromCharCode(97 + data.incisos.length); // a, b, c, ...
    onChange({
      ...data,
      incisos: [
        ...data.incisos,
        {
          id: incisoId,
          sentence: ["", "blank1", ""],
          options: [
            { id: `${incisoId}_option1`, text: "", position: "blank1" },
            {
              id: `${incisoId}_option2`,
              text: "",
              position: "none",
            },
            { id: `${incisoId}_option3`, text: "", position: "none" },
          ],
        },
      ],
    });
  };

  const removeInciso = (index: number) => {
    const newIncisos = [...data.incisos];
    newIncisos.splice(index, 1);
    // Reorder remaining incisos and their options
    const reorderedIncisos = newIncisos.map((inciso, idx) => {
      const newId = String.fromCharCode(97 + idx); // Reassign a, b, c, ...
      return {
        ...inciso,
        id: newId,
        options: inciso.options.map((option, optIdx) => ({
          ...option,
          id: `${newId}_option${optIdx + 1}`,
        })),
      };
    });
    onChange({ ...data, incisos: reorderedIncisos });
  };

  const updateSentencePart = (
    incisoIndex: number,
    partIndex: number,
    value: string
  ) => {
    const newIncisos = [...data.incisos];
    const newSentence = [...newIncisos[incisoIndex].sentence];
    newSentence[partIndex] = value;
    newIncisos[incisoIndex] = {
      ...newIncisos[incisoIndex],
      sentence: newSentence,
    };
    onChange({ ...data, incisos: newIncisos });
  };

  const updateOption = (
    incisoIndex: number,
    optionIndex: number,
    field: keyof FillBlankOption,
    value: string
  ) => {
    const newIncisos = [...data.incisos];
    const newOptions = [...newIncisos[incisoIndex].options];
    newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
    newIncisos[incisoIndex] = {
      ...newIncisos[incisoIndex],
      options: newOptions,
    };
    onChange({ ...data, incisos: newIncisos });
  };

  const addSentencePart = (incisoIndex: number) => {
    const newIncisos = [...data.incisos];
    const blankCount = newIncisos[incisoIndex].sentence.filter((part) =>
      part.startsWith("blank")
    ).length;
    const newBlankId = `blank${blankCount + 1}`;
    newIncisos[incisoIndex].sentence.push(newBlankId);
    newIncisos[incisoIndex].sentence.push("");
    onChange({ ...data, incisos: newIncisos });
  };

  const removeSentencePart = (incisoIndex: number, partIndex: number) => {
    const newIncisos = [...data.incisos];
    const removedPart = newIncisos[incisoIndex].sentence[partIndex];
    const oldSentence = [...newIncisos[incisoIndex].sentence];

    // Remove the blank and the text after it
    newIncisos[incisoIndex].sentence.splice(partIndex, 2);

    // Reorder remaining blanks
    const newSentence = reorderBlanks(newIncisos[incisoIndex].sentence);
    newIncisos[incisoIndex].sentence = newSentence;

    // Update options positions to match new blank numbers
    if (removedPart.startsWith("blank")) {
      const oldBlanks = oldSentence.filter((part) => part.startsWith("blank"));
      const newBlanks = newSentence.filter((part) => part.startsWith("blank"));

      let options = newIncisos[incisoIndex].options;

      // Update positions for each blank that was renumbered
      oldBlanks.forEach((oldBlank, idx) => {
        if (idx < newBlanks.length) {
          options = updateBlankReferences(options, oldBlank, newBlanks[idx]);
        } else {
          // If this blank was removed, set its options to 'none'
          options = updateBlankReferences(options, oldBlank, "none");
        }
      });

      newIncisos[incisoIndex].options = options;
    }

    onChange({ ...data, incisos: newIncisos });
  };

  const addOption = (incisoIndex: number) => {
    const newIncisos = [...data.incisos];
    const incisoId = newIncisos[incisoIndex].id;
    const optionCount = newIncisos[incisoIndex].options.length;
    newIncisos[incisoIndex].options.push({
      id: `${incisoId}_option${optionCount + 1}`,
      text: "",
      position: "none",
    });
    onChange({ ...data, incisos: newIncisos });
  };

  const removeOption = (incisoIndex: number, optionIndex: number) => {
    const newIncisos = [...data.incisos];
    const incisoId = newIncisos[incisoIndex].id;
    newIncisos[incisoIndex].options.splice(optionIndex, 1);
    // Reorder remaining options
    newIncisos[incisoIndex].options = reorderOptions(
      incisoId,
      newIncisos[incisoIndex].options
    );
    onChange({ ...data, incisos: newIncisos });
  };

  const reorderBlanks = (sentence: string[]): string[] => {
    let blankCounter = 1;
    return sentence.map((part) => {
      if (part.startsWith("blank")) {
        const newBlank = `blank${blankCounter}`;
        blankCounter++;
        return newBlank;
      }
      return part;
    });
  };

  const reorderOptions = (
    incisoId: string,
    options: FillBlankOption[]
  ): FillBlankOption[] => {
    return options.map((option, index) => ({
      ...option,
      id: `${incisoId}_option${index + 1}`,
    }));
  };

  const updateBlankReferences = (
    options: FillBlankOption[],
    oldBlank: string,
    newBlank: string
  ): FillBlankOption[] => {
    return options.map((option) => ({
      ...option,
      position: option.position === oldBlank ? newBlank : option.position,
    }));
  };

  const getAvailableBlanks = (inciso: FillBlankInciso) => {
    const blanks = inciso.sentence
      .filter((part) => part.startsWith("blank"))
      .map((blank) => ({ value: blank, label: blank }));
    return [{ value: "none", label: "None" }, ...blanks];
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            replacements={mathReplacements}
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
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            placeholder="Puedes usar HTML para dar formato al texto"
            replacements={mathReplacements}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Incisos</h3>
          <button
            onClick={addInciso}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Añadir Inciso
          </button>
        </div>

        {data.incisos.map((inciso, incisoIndex) => (
          <div key={inciso.id} className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                {inciso.id}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => addSentencePart(incisoIndex)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Añadir Espacio en Blanco
                </button>
                <button
                  onClick={() => removeInciso(incisoIndex)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Partes de la Oración:
              </label>
              <div className="space-y-2">
                {inciso.sentence.map((part, partIndex) => (
                  <div
                    key={`${inciso.id}_part${partIndex}`}
                    className="flex gap-2"
                  >
                    {part.startsWith("blank") ? (
                      <>
                        <div className="flex-1 px-3 py-2 bg-gray-100 rounded-md text-gray-600">
                          {part}
                        </div>
                        <button
                          onClick={() =>
                            removeSentencePart(incisoIndex, partIndex)
                          }
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <VoiceInput
                        inputType="input"
                        value={part}
                        onChange={(value) =>
                          updateSentencePart(incisoIndex, partIndex, value)
                        }
                        className="flex-1 rounded-md border-gray-300 shadow-sm sm:text-sm"
                        placeholder="Escribe el Texto aquí"
                        replacements={mathReplacements}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Respuestas:
                </label>
                <button
                  onClick={() => addOption(incisoIndex)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Añadir Respuesta
                </button>
              </div>
              {inciso.options.map((option, optionIndex) => (
                <div key={option.id} className="flex gap-2">
                  <VoiceInput
                    inputType="input"
                    value={option.text}
                    onChange={(value) =>
                      updateOption(incisoIndex, optionIndex, "text", value)
                    }
                    className="flex-1 rounded-md border-gray-300 shadow-sm sm:text-sm"
                    placeholder="Texto de la Respuesta"
                    replacements={mathReplacements}
                  />
                  <select
                    value={option.position}
                    onChange={(e) =>
                      updateOption(
                        incisoIndex,
                        optionIndex,
                        "position",
                        e.target.value
                      )
                    }
                    className="w-32 rounded-md border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors sm:text-sm font-mono"
                  >
                    {getAvailableBlanks(inciso).map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeOption(incisoIndex, optionIndex)}
                    className="text-gray-400 hover:text-red-500 font-mono"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FillBlankForm;
