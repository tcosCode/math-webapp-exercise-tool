interface JsonViewerProps {
  data: unknown;
}

function JsonViewer({ data }: JsonViewerProps) {
  return (
    <pre className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-[600px] text-sm">
      <code className="text-gray-800">{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

export default JsonViewer;
