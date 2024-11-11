import { JSX } from "react/jsx-runtime";
import { ReplacementRule, applyReplacements } from "../utils/replacements";

interface TextInputCustomProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  replacements?: ReplacementRule[];
}

const TextInputCustom = (props: TextInputCustomProps): JSX.Element => {
  return (
    <input
      type="text"
      value={props.value}
      onChange={(e) => {
        // Apply replacements also when typing
        const processedText = applyReplacements(
          e.target.value,
          props.replacements ?? []
        );
        props.onChange(processedText);
      }}
      placeholder={props.placeholder}
      className={`${props.className} pr-10 border border-gray-300 px-4 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-mono`}
    />
  );
};
export default TextInputCustom;
