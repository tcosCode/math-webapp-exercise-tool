import { ReplacementRule, applyReplacements } from "../utils/replacements";

interface TextAreaCustomProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  replacements?: ReplacementRule[];
  rows?: number;
}

const TextAreaCustom: React.FC<TextAreaCustomProps> = (
  props: TextAreaCustomProps
): JSX.Element => {
  return (
    <textarea
      value={props.value}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Apply replacements also when typing
        const processedText: string = applyReplacements(
          e.target.value,
          props.replacements ?? []
        );
        props.onChange(processedText);
      }}
      placeholder={props.placeholder}
      className={`${props.className} pr-10 resize-none overflow-hidden border border-gray-300 px-4 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-mono`}
      rows={props.rows ?? 3}
    />
  );
};
export default TextAreaCustom;
