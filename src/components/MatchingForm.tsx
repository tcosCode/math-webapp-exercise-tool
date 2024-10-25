import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { MatchingData, MatchingInciso } from '../types/json-types';

interface MatchingFormProps {
  data: MatchingData;
  onChange: (data: MatchingData) => void;
}

function MatchingForm({ data, onChange }: MatchingFormProps) {
  const addPair = () => {
    const nextPairId = Math.max(0, ...data.incisos.map(i => i.pairId)) + 1;
    onChange({
      ...data,
      incisos: [
        ...data.incisos,
        {
          text: '<strong>Pregunta:</strong> ',
          pairId: nextPairId,
        },
        {
          text: 'Respuesta: ',
          pairId: nextPairId,
        },
      ],
    });
  };

  const removePair = (pairId: number) => {
    const newIncisos = data.incisos.filter(inciso => inciso.pairId !== pairId);
    onChange({ ...data, incisos: newIncisos });
  };

  const updateInciso = (index: number, text: string) => {
    const newIncisos = [...data.incisos];
    newIncisos[index] = { ...newIncisos[index], text };
    onChange({ ...data, incisos: newIncisos });
  };

  const getPairs = () => {
    const pairs: { question: MatchingInciso; answer: MatchingInciso }[] = [];
    const pairIds = new Set(data.incisos.map(i => i.pairId));
    
    pairIds.forEach(pairId => {
      const items = data.incisos.filter(i => i.pairId === pairId);
      const question = items.find(i => i.text.includes('Pregunta'));
      const answer = items.find(i => i.text.includes('Respuesta'));
      if (question && answer) {
        pairs.push({ question, answer });
      }
    });

    return pairs.sort((a, b) => a.question.pairId - b.question.pairId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="texto" className="block text-sm font-medium text-gray-700">
            Instructions Text
          </label>
          <input
            type="text"
            id="texto"
            value={data.texto}
            onChange={(e) => onChange({ ...data, texto: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Matching Pairs</h3>
          <button
            onClick={addPair}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Pair
          </button>
        </div>

        {getPairs().map(({ question, answer }, index) => (
          <div key={question.pairId} className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                {index + 1}
              </span>
              <button
                onClick={() => removePair(question.pairId)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Question</label>
              <textarea
                value={question.text}
                onChange={(e) => updateInciso(data.incisos.indexOf(question), e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                placeholder="<strong>Pregunta:</strong> Your question here"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Answer</label>
              <textarea
                value={answer.text}
                onChange={(e) => updateInciso(data.incisos.indexOf(answer), e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                placeholder="Respuesta: Your answer here"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchingForm;