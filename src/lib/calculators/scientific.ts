export interface ScientificInput {
  expression: string;
  angleMode: "deg" | "rad";
}

export interface ScientificResult {
  result: number | null;
  error: string | null;
}

// Factorial helper
export function factorial(num: number): number {
  if (num < 0) return NaN;
  if (num === 0 || num === 1) return 1;
  let result = 1;
  for (let i = 2; i <= num; i++) {
    result *= i;
  }
  return result;
}

// Token types
type TokenType = "NUMBER" | "OPERATOR" | "FUNCTION" | "LPAREN" | "RPAREN" | "CONSTANT";

interface Token {
  type: TokenType;
  value: string;
}

export function parseAndEvaluate(expression: string, angleMode: "deg" | "rad" = "rad"): number {
  // Pre-process expression
  let cleaned = expression
    .replace(/\s+/g, "")
    .replace(/π/g, "pi")
    .replace(/×/g, "*")
    .replace(/÷/g, "/");

  // Implicit multiplication: e.g., "2(3)" -> "2*(3)", "2pi" -> "2*pi", "pi(" -> "pi*("
  cleaned = cleaned.replace(/(\d)(\()/g, "$1*$2");
  cleaned = cleaned.replace(/(\))(\()/g, "$1*$2");
  cleaned = cleaned.replace(/(\))(\d)/g, "$1*$2");
  cleaned = cleaned.replace(/(\d)(pi|e)/gi, "$1*$2");
  cleaned = cleaned.replace(/(pi|e)(\()/gi, "$1*$2");
  cleaned = cleaned.replace(/(\))(pi|e)/gi, "$1*$2");

  const tokens: Token[] = [];
  let i = 0;

  const operators = new Set(["+", "-", "*", "/", "^", "%", "!"]);
  const functions = new Set(["sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "sqrt", "cbrt"]);

  while (i < cleaned.length) {
    const char = cleaned[i];

    // Numbers
    if (/\d/.test(char) || (char === "." && i + 1 < cleaned.length && /\d/.test(cleaned[i + 1]))) {
      let numStr = "";
      while (i < cleaned.length && (/[0-9.]/.test(cleaned[i]) || (cleaned[i] === "e" && /[+-]/.test(cleaned[i+1]) && /\d/.test(cleaned[i-1])))) {
        numStr += cleaned[i];
        i++;
      }
      tokens.push({ type: "NUMBER", value: numStr });
      continue;
    }

    // Parentheses
    if (char === "(") {
      tokens.push({ type: "LPAREN", value: "(" });
      i++;
      continue;
    }
    if (char === ")") {
      tokens.push({ type: "RPAREN", value: ")" });
      i++;
      continue;
    }

    // Operators
    if (operators.has(char)) {
      // Unary minus handling
      if (char === "-" && (tokens.length === 0 || tokens[tokens.length - 1].type === "LPAREN" || operators.has(tokens[tokens.length - 1].value))) {
        // We push a special unary minus operator
        tokens.push({ type: "OPERATOR", value: "u-" });
      } else {
        tokens.push({ type: "OPERATOR", value: char });
      }
      i++;
      continue;
    }

    // Alphabetic tokens (functions or constants)
    if (/[a-zA-Z]/.test(char)) {
      let word = "";
      while (i < cleaned.length && /[a-zA-Z0-9]/.test(cleaned[i])) {
        word += cleaned[i];
        i++;
      }

      if (functions.has(word)) {
        tokens.push({ type: "FUNCTION", value: word });
      } else if (word.toLowerCase() === "pi") {
        tokens.push({ type: "CONSTANT", value: "pi" });
      } else if (word.toLowerCase() === "e") {
        tokens.push({ type: "CONSTANT", value: "e" });
      } else {
        throw new Error(`Unknown identifier: ${word}`);
      }
      continue;
    }

    throw new Error(`Unexpected character: ${char}`);
  }

  // Shunting-yard algorithm
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];

  const precedence: Record<string, number> = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "%": 2,
    "^": 3,
    "u-": 4, // high precedence for unary minus
    "!": 5, // high precedence for factorial
  };

  const associativity: Record<string, "L" | "R"> = {
    "+": "L",
    "-": "L",
    "*": "L",
    "/": "L",
    "%": "L",
    "^": "R",
    "u-": "R",
    "!": "L",
  };

  for (const token of tokens) {
    if (token.type === "NUMBER") {
      outputQueue.push(token);
    } else if (token.type === "CONSTANT") {
      outputQueue.push(token);
    } else if (token.type === "FUNCTION") {
      operatorStack.push(token);
    } else if (token.type === "OPERATOR") {
      const o1 = token.value;
      let top = operatorStack[operatorStack.length - 1];

      while (
        top &&
        (top.type === "OPERATOR" || top.type === "FUNCTION") &&
        (top.type === "FUNCTION" ||
          precedence[top.value] > precedence[o1] ||
          (precedence[top.value] === precedence[o1] && associativity[o1] === "L"))
      ) {
        outputQueue.push(operatorStack.pop()!);
        top = operatorStack[operatorStack.length - 1];
      }
      operatorStack.push(token);
    } else if (token.type === "LPAREN") {
      operatorStack.push(token);
    } else if (token.type === "RPAREN") {
      let top = operatorStack[operatorStack.length - 1];
      while (top && top.type !== "LPAREN") {
        outputQueue.push(operatorStack.pop()!);
        top = operatorStack[operatorStack.length - 1];
      }
      if (!top) {
        throw new Error("Mismatched parentheses (missing left parenthesis).");
      }
      operatorStack.pop(); // pop LPAREN

      // If top is a function, pop it to output queue
      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === "FUNCTION") {
        outputQueue.push(operatorStack.pop()!);
      }
    }
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop()!;
    if (top.type === "LPAREN" || top.type === "RPAREN") {
      throw new Error("Mismatched parentheses.");
    }
    outputQueue.push(top);
  }

  // RPN Evaluation Stack
  const evalStack: number[] = [];

  for (const token of outputQueue) {
    if (token.type === "NUMBER") {
      evalStack.push(parseFloat(token.value));
    } else if (token.type === "CONSTANT") {
      if (token.value === "pi") evalStack.push(Math.PI);
      else if (token.value === "e") evalStack.push(Math.E);
    } else if (token.type === "OPERATOR") {
      if (token.value === "u-") {
        const val = evalStack.pop();
        if (val === undefined) throw new Error("Invalid expression.");
        evalStack.push(-val);
      } else if (token.value === "!") {
        const val = evalStack.pop();
        if (val === undefined) throw new Error("Invalid expression.");
        evalStack.push(factorial(val));
      } else {
        const b = evalStack.pop();
        const a = evalStack.pop();
        if (a === undefined || b === undefined) throw new Error("Invalid expression.");

        switch (token.value) {
          case "+": evalStack.push(a + b); break;
          case "-": evalStack.push(a - b); break;
          case "*": evalStack.push(a * b); break;
          case "/":
            if (b === 0) throw new Error("Division by zero.");
            evalStack.push(a / b);
            break;
          case "%": evalStack.push(a % b); break;
          case "^": evalStack.push(Math.pow(a, b)); break;
          default: throw new Error(`Unknown operator: ${token.value}`);
        }
      }
    } else if (token.type === "FUNCTION") {
      const val = evalStack.pop();
      if (val === undefined) throw new Error("Invalid expression.");

      let radVal = val;
      if (angleMode === "deg" && ["sin", "cos", "tan", "asin", "acos", "atan"].includes(token.value)) {
        if (["sin", "cos", "tan"].includes(token.value)) {
          radVal = (val * Math.PI) / 180;
        }
      }

      let res = 0;
      switch (token.value) {
        case "sin": res = Math.sin(radVal); break;
        case "cos": res = Math.cos(radVal); break;
        case "tan": res = Math.tan(radVal); break;
        case "asin":
          res = Math.asin(val);
          if (angleMode === "deg") res = (res * 180) / Math.PI;
          break;
        case "acos":
          res = Math.acos(val);
          if (angleMode === "deg") res = (res * 180) / Math.PI;
          break;
        case "atan":
          res = Math.atan(val);
          if (angleMode === "deg") res = (res * 180) / Math.PI;
          break;
        case "log":
          if (val <= 0) throw new Error("Logarithm domain error (input <= 0).");
          res = Math.log10(val);
          break;
        case "ln":
          if (val <= 0) throw new Error("Natural logarithm domain error (input <= 0).");
          res = Math.log(val);
          break;
        case "sqrt":
          if (val < 0) throw new Error("Square root domain error (input < 0).");
          res = Math.sqrt(val);
          break;
        case "cbrt": res = Math.cbrt(val); break;
        default: throw new Error(`Unknown function: ${token.value}`);
      }
      evalStack.push(res);
    }
  }

  if (evalStack.length !== 1) {
    throw new Error("Invalid expression syntax.");
  }

  return evalStack[0];
}

export function calculateScientific(input: ScientificInput): ScientificResult {
  if (!input.expression.trim()) {
    return { result: null, error: null };
  }
  try {
    const res = parseAndEvaluate(input.expression, input.angleMode);
    return {
      result: isNaN(res) ? null : res,
      error: isNaN(res) ? "Result is Undefined" : null,
    };
  } catch (err: any) {
    return {
      result: null,
      error: err?.message || "Invalid Syntax",
    };
  }
}
