import { JsonType } from "../types/json-types";

interface TypeSelectorProps {
  selectedType: JsonType | null;
  onTypeSelect: (type: JsonType) => void;
}

const types: JsonType[] = [
  "TRUEFALSE",
  "CHOOSEANSWER",
  "MATCHING",
  "FILLBLANK",
  "PROBLEM",
];

function TypeSelector({ selectedType, onTypeSelect }: TypeSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Selecciona el tipo de Ejercicio
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onTypeSelect(type)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${
                selectedType === type
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TypeSelector;
