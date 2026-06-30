export type Matrix = number[][];

export interface MatrixInput {
  matrixA: Matrix;
  matrixB?: Matrix;
  operation: "add" | "subtract" | "multiply" | "transpose" | "determinant" | "inverse" | "rank";
}

export interface MatrixResult {
  resultMatrix: Matrix | null;
  resultScalar: number | null;
  steps: string[];
  error: string | null;
}

// Helpers for matrix operations
export function transpose(m: Matrix): Matrix {
  const r = m.length;
  const c = m[0].length;
  const result: Matrix = Array.from({ length: c }, () => Array(r).fill(0));
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      result[j][i] = m[i][j];
    }
  }
  return result;
}

export function determinant(m: Matrix): number {
  const n = m.length;
  if (n !== m[0].length) throw new Error("Matrix must be square.");

  if (n === 1) return m[0][0];
  if (n === 2) {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  }

  let det = 0;
  for (let j = 0; j < n; j++) {
    det += Math.pow(-1, j) * m[0][j] * determinant(subMatrix(m, 0, j));
  }
  return det;
}

function subMatrix(m: Matrix, row: number, col: number): Matrix {
  return m
    .filter((_, r) => r !== row)
    .map((rLine) => rLine.filter((_, c) => c !== col));
}

export function inverse(m: Matrix): Matrix | null {
  const n = m.length;
  if (n !== m[0].length) return null;

  const det = determinant(m);
  if (Math.abs(det) < 1e-9) return null; // Singular matrix

  if (n === 1) return [[1 / m[0][0]]];

  const adjugate: Matrix = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // Sign cofactor * submatrix determinant
      const cofactorDet = determinant(subMatrix(m, i, j));
      const sign = Math.pow(-1, i + j);
      adjugate[j][i] = sign * cofactorDet; // note the transpose [j][i] instead of [i][j]
    }
  }

  const inv: Matrix = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      inv[i][j] = adjugate[i][j] / det;
    }
  }

  return inv;
}

export function getRank(m: Matrix): number {
  const r = m.length;
  const c = m[0].length;
  
  // Clone matrix
  const mat = m.map((row) => [...row]);
  let rank = c;

  for (let row = 0; row < rank; row++) {
    // Check if diagonal element is non-zero
    if (row < r && mat[row][row] !== 0) {
      for (let col = 0; col < r; col++) {
        if (col !== row) {
          const factor = mat[col][row] / mat[row][row];
          for (let i = row; i < c; i++) {
            mat[col][i] -= factor * mat[row][i];
          }
        }
      }
    } else {
      // Find non-zero element in same column in other rows
      let reduce = true;
      for (let i = row + 1; i < r; i++) {
        if (mat[i][row] !== 0) {
          // Swap rows
          const temp = mat[row];
          mat[row] = mat[i];
          mat[i] = temp;
          reduce = false;
          break;
        }
      }
      if (reduce) {
        rank--;
        // Copy last column to current column
        for (let i = 0; i < r; i++) {
          mat[i][row] = mat[i][rank];
        }
      }
      row--;
    }
  }

  // Count non-zero rows in row-echelon form
  let nonZeroRows = 0;
  for (let i = 0; i < r; i++) {
    let allZero = true;
    for (let j = 0; j < c; j++) {
      if (Math.abs(mat[i][j]) > 1e-9) {
        allZero = false;
        break;
      }
    }
    if (!allZero) {
      nonZeroRows++;
    }
  }

  return Math.min(nonZeroRows, c);
}

export function calculateMatrix(input: MatrixInput): MatrixResult {
  const { matrixA, matrixB, operation } = input;
  const rA = matrixA.length;
  const cA = matrixA[0].length;
  const steps: string[] = [];

  // Transpose
  if (operation === "transpose") {
    steps.push(`Transpose swaps rows with columns.`);
    steps.push(`Row 1 of A becomes Column 1 of Aᵀ, and so forth.`);
    const res = transpose(matrixA);
    return {
      resultMatrix: res,
      resultScalar: null,
      steps,
      error: null,
    };
  }

  // Determinant
  if (operation === "determinant") {
    if (rA !== cA) {
      return {
        resultMatrix: null,
        resultScalar: null,
        steps,
        error: "Determinant is only defined for square matrices.",
      };
    }
    steps.push(`Calculate determinant of square matrix A (${rA}x${cA}).`);
    if (rA === 2) {
      steps.push(`Formula for 2x2: det(A) = ad - bc`);
      steps.push(`det(A) = (${matrixA[0][0]} × ${matrixA[1][1]}) - (${matrixA[0][1]} × ${matrixA[1][0]})`);
    } else if (rA === 3) {
      steps.push(`Co-factor expansion along the first row.`);
      steps.push(`det(A) = a(ei − fh) − b(di − fg) + c(dh − eg)`);
    }
    const det = determinant(matrixA);
    steps.push(`det(A) = ${det}`);
    return {
      resultMatrix: null,
      resultScalar: det,
      steps,
      error: null,
    };
  }

  // Inverse
  if (operation === "inverse") {
    if (rA !== cA) {
      return {
        resultMatrix: null,
        resultScalar: null,
        steps,
        error: "Inverse is only defined for square matrices.",
      };
    }
    const det = determinant(matrixA);
    steps.push(`Step 1: Calculate determinant, det(A) = ${det}.`);
    if (Math.abs(det) < 1e-9) {
      return {
        resultMatrix: null,
        resultScalar: null,
        steps: [...steps, "Since det(A) = 0, this matrix is singular and has no inverse."],
        error: "Matrix is singular (determinant is zero) and cannot be inverted.",
      };
    }
    steps.push(`Step 2: Find the matrix of cofactors, transpose it to get the adjugate matrix, and divide by det(A).`);
    const inv = inverse(matrixA);
    return {
      resultMatrix: inv,
      resultScalar: null,
      steps,
      error: null,
    };
  }

  // Rank
  if (operation === "rank") {
    steps.push(`Rank is the number of linearly independent rows in the matrix.`);
    steps.push(`Perform Gaussian elimination to transform the matrix to Row Echelon Form (REF).`);
    const rank = getRank(matrixA);
    steps.push(`Number of non-zero rows after row reduction = ${rank}`);
    return {
      resultMatrix: null,
      resultScalar: rank,
      steps,
      error: null,
    };
  }

  // Operations needing matrix B
  if (!matrixB) {
    return {
      resultMatrix: null,
      resultScalar: null,
      steps,
      error: "Matrix B is required for this operation.",
    };
  }

  const rB = matrixB.length;
  const cB = matrixB[0].length;

  if (operation === "add") {
    if (rA !== rB || cA !== cB) {
      return {
        resultMatrix: null,
        resultScalar: null,
        steps,
        error: "Matrices must have the same dimensions for addition.",
      };
    }
    const res: Matrix = matrixA.map((row, i) => row.map((val, j) => val + matrixB[i][j]));
    steps.push("Matrix addition: Add corresponding elements A[i][j] + B[i][j].");
    return {
      resultMatrix: res,
      resultScalar: null,
      steps,
      error: null,
    };
  }

  if (operation === "subtract") {
    if (rA !== rB || cA !== cB) {
      return {
        resultMatrix: null,
        resultScalar: null,
        steps,
        error: "Matrices must have the same dimensions for subtraction.",
      };
    }
    const res: Matrix = matrixA.map((row, i) => row.map((val, j) => val - matrixB[i][j]));
    steps.push("Matrix subtraction: Subtract corresponding elements A[i][j] - B[i][j].");
    return {
      resultMatrix: res,
      resultScalar: null,
      steps,
      error: null,
    };
  }

  if (operation === "multiply") {
    if (cA !== rB) {
      return {
        resultMatrix: null,
        resultScalar: null,
        steps,
        error: `Inner dimensions must match. Matrix A columns (${cA}) must equal Matrix B rows (${rB}).`,
      };
    }
    const res: Matrix = Array.from({ length: rA }, () => Array(cB).fill(0));
    steps.push("Matrix multiplication: Multiply row items of A by column items of B and sum them.");
    for (let i = 0; i < rA; i++) {
      for (let j = 0; j < cB; j++) {
        let sum = 0;
        const productsList: string[] = [];
        for (let k = 0; k < cA; k++) {
          sum += matrixA[i][k] * matrixB[k][j];
          productsList.push(`(${matrixA[i][k]} × ${matrixB[k][j]})`);
        }
        res[i][j] = sum;
        if (i < 2 && j < 2) {
          steps.push(`Result[${i + 1}][${j + 1}] = ${productsList.join(" + ")} = ${sum}`);
        }
      }
    }
    return {
      resultMatrix: res,
      resultScalar: null,
      steps,
      error: null,
    };
  }

  return {
    resultMatrix: null,
    resultScalar: null,
    steps,
    error: "Unknown operation.",
  };
}
