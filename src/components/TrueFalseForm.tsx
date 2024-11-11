import { Plus, Trash2 } from "lucide-react";
import VoiceInput from "./VoiceInput";
import { mathReplacements } from "../utils/replacements";
import { TrueFalseData } from "../types/json-types";

interface TrueFalseFormProps {
  data: TrueFalseData;
  onChange: (data: TrueFalseData) => void;
}

function TrueFalseForm({ data, onChange }: TrueFalseFormProps) {
  const addInciso = () => {
    onChange({
      ...data,
      incisos: [
        ...data.incisos,
        {
          id: String.fromCharCode(97 + data.incisos.length), // a, b, c, ...
          exercise: "",
          validation: "true",
        },
      ],
    });
  };

  const removeInciso = (index: number) => {
    const newIncisos = [...data.incisos];
    newIncisos.splice(index, 1);
    // Reorder remaining incisos
    const reorderedIncisos = newIncisos.map((inciso, idx) => ({
      ...inciso,
      id: String.fromCharCode(97 + idx), // Reassign a, b, c, ...
    }));
    onChange({ ...data, incisos: reorderedIncisos });
  };

  const updateInciso = (index: number, field: string, value: string) => {
    const newIncisos = [...data.incisos];
    newIncisos[index] = { ...newIncisos[index], [field]: value };
    onChange({ ...data, incisos: newIncisos });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <VoiceInput
            id={`title-${data.id}`}
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
            id={`enunciado-${data.id}`}
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
          <h3 className="text-lg font-medium text-gray-900">Incisos</h3>
          <button
            onClick={addInciso}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Añadir Inciso
          </button>
        </div>

        {data.incisos.map((inciso, index) => (
          <div key={inciso.id} className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                {inciso.id}
              </span>
              <button
                onClick={() => removeInciso(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Texto del inciso
              </label>
              <VoiceInput
                id={`inciso-${inciso.id}`}
                inputType="textarea"
                value={inciso.exercise}
                onChange={(value) => updateInciso(index, "exercise", value)}
                replacements={mathReplacements}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Validación
              </label>
              <select
                value={inciso.validation}
                onChange={(e) =>
                  updateInciso(index, "validation", e.target.value)
                }
                className="mt-1 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors sm:text-sm font-mono"
              >
                <option value="true">Verdadero</option>
                <option value="false">Falso</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrueFalseForm;
