export interface ReplacementRule {
  match: string | RegExp;
  replace: string;
}

export const mathReplacements: ReplacementRule[] = [
  { match: /mayor que/gi, replace: ">" },
  { match: /menor que/gi, replace: "<" },
  /* { match: /mas|más/gi, replace: "+" }, */
  /*  { match: /menos/gi, replace: "-" }, */
  /*  { match: /multiplicado por|por/gi, replace: "*" },
  { match: /entre/gi, replace: "/" }, */
  { match: /punto y coma/gi, replace: ";" },
  { match: /abrir paréntesis|abre paréntesis/gi, replace: "(" },
  { match: /cerrar paréntesis|cierra paréntesis/gi, replace: ")" },
  /* { match: /igual a|igual/gi, replace: "=" }, */
  /*   { match: /elevado a/gi, replace: "<sup>" },
  { match: /cerrar potencia/gi, replace: "</sup>" },
  { match: /raíz cuadrada de|raíz de/gi, replace: "√" },
  { match: /sub índice/gi, replace: "subíndice" },
  { match: /abrir subíndice|abre subíndice/gi, replace: "<sub>" },
  { match: /cerrar subíndice|cierra subíndice/gi, replace: "</sub>" },
  { match: /grados/gi, replace: "°" },
  { match: /porcentaje/gi, replace: "%" },
  { match: /pi/gi, replace: "π" },
  { match: /seno de|sen/gi, replace: "sen" },
  { match: /coseno de|cos/gi, replace: "cos" },
  { match: /tangente de|tan/gi, replace: "tan" },
  { match: /secante de|sec/gi, replace: "sec" },
  { match: /cosecante de|csc/gi, replace: "csc" },
  { match: /cotangente de|cot/gi, replace: "cot" },
  { match: /logaritmo base 10 de|log/gi, replace: "log" },
  { match: /logaritmo natural de|ln/gi, replace: "ln" },
  { match: /logaritmo base 2 de/gi, replace: "log2" },
  { match: /logaritmo base/gi, replace: "log" },
  { match: /logaritmo/gi, replace: "log" },
  { match: /logaritmo natural/gi, replace: "ln" },
  { match: /logaritmo base 2/gi, replace: "log2" },
  { match: /logaritmo base 10/gi, replace: "log" },
  { match: /logaritmo base e/gi, replace: "ln" },
  { match: /logaritmo base 2/gi, replace: "log2" },
  { match: /logaritmo base/gi, replace: "log" },
  { match: /logaritmo/gi, replace: "log" },
  { match: /logaritmo natural/gi, replace: "ln" },
  { match: /logaritmo base 2/gi, replace: "log2" },
  { match: /logaritmo base 10/gi, replace: "log" },
  { match: /logaritmo base e/gi, replace: "ln" }, */
];

export const applyReplacements = (
  text: string,
  rules: ReplacementRule[]
): string => {
  let result = text;
  for (const rule of rules) {
    result = result.replace(rule.match, rule.replace);
  }
  return result;
};
