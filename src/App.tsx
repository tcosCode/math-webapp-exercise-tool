import { useState } from "react";
import { Copy, FileJson, Save, Share2 } from "lucide-react";
import JsonViewer from "./components/JsonViewer";
import TypeSelector from "./components/TypeSelector";
import TrueFalseForm from "./components/TrueFalseForm";
import ChooseAnswerForm from "./components/ChooseAnswerForm";
import MatchingForm from "./components/MatchingForm";
import ProblemForm from "./components/ProblemForm";
import {
  JsonType,
  JsonData,
  TrueFalseData,
  ChooseAnswerData,
  MatchingData,
  ProblemData,
} from "./types/json-types";

function App() {
  const [selectedType, setSelectedType] = useState<JsonType | null>(null);
  const [jsonData, setJsonData] = useState<JsonData>({
    id: "1",
    type: "TRUEFALSE",
    title: "",
    texto: "",
    incisos: [],
  });

  const handleTypeSelect = (type: JsonType) => {
    setSelectedType(type);
    if (type === "CHOOSEANSWER") {
      setJsonData({
        id: "1",
        type: "CHOOSEANSWER",
        title: "",
        texto: "",
        incisos: [],
      });
    } else if (type === "TRUEFALSE") {
      setJsonData({
        id: "1",
        type: "TRUEFALSE",
        title: "",
        texto: "",
        incisos: [],
      });
    } else if (type === "MATCHING") {
      setJsonData({
        id: "1",
        type: "MATCHING",
        title: "",
        texto: "",
        incisos: [],
      });
    } else if (type === "PROBLEM") {
      setJsonData({
        id: "1",
        type: "PROBLEM",
        title: "",
        texto: "",
        incisos: [],
      });
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
  };

  const handleSaveJson = () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${jsonData.type.toLowerCase()}_${jsonData.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShareJson = () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "text/plain",
    });
    const file = new File(
      [blob],
      `${jsonData.type.toLowerCase()}_${jsonData.id}.txt`,
      {
        type: "text/plain",
      }
    );
    navigator
      .share({
        title: "Compartir JSON",
        text: "Aquí tienes el JSON convertido a archivo de texto:",
        files: [file],
      })
      .then(() => {
        console.log("Compartido con éxito");
      })
      .catch((error) => {
        console.error("Error al compartir:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <FileJson className="h-6 w-6 text-indigo-600" />
            <h1 className="text-xl font-semibold text-gray-900">
              JSON Generator Tool
            </h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <TypeSelector
              selectedType={selectedType}
              onTypeSelect={handleTypeSelect}
            />

            {selectedType === "TRUEFALSE" && (
              <TrueFalseForm
                data={jsonData as TrueFalseData}
                onChange={setJsonData}
              />
            )}

            {selectedType === "CHOOSEANSWER" && (
              <ChooseAnswerForm
                data={jsonData as ChooseAnswerData}
                onChange={setJsonData}
              />
            )}

            {selectedType === "PROBLEM" && (
              <ProblemForm
                data={jsonData as ProblemData}
                onChange={setJsonData}
              />
            )}

            {selectedType === "MATCHING" && (
              <MatchingForm
                data={jsonData as MatchingData}
                onChange={setJsonData}
              />
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Generated JSON
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Copy className="h-4 w-4 mr-1.5" />
                  Copy
                </button>
                <button
                  onClick={handleSaveJson}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Save className="h-4 w-4 mr-1.5" />
                  Save
                </button>
                <button
                  onClick={handleShareJson}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Share2 className="h-4 w-4 mr-1.5" />
                  Share
                </button>
              </div>
            </div>
            <JsonViewer data={jsonData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
