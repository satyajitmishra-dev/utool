export interface GpaSubject {
  name?: string;
  grade: string; // "A+", "A", "A-", "B+", etc.
  credits: number;
}

export interface GpaInput {
  subjects: GpaSubject[];
  scale: "4.0" | "4.33" | "custom";
  customScale?: Record<string, number>;
}

export interface GpaResult {
  gpa: number;
  totalCredits: number;
  totalPoints: number;
  gradeDistribution: Record<string, number>;
  gradePointsList: { name: string; grade: string; credits: number; points: number }[];
}

export const STANDARD_GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D": 1.0,
  "F": 0.0,
};

export const WEIGHTED_GRADE_POINTS: Record<string, number> = {
  "A+": 4.33,
  "A": 4.0,
  "A-": 3.67,
  "B+": 3.33,
  "B": 3.0,
  "B-": 2.67,
  "C+": 2.33,
  "C": 2.0,
  "C-": 1.67,
  "D+": 1.33,
  "D": 1.0,
  "F": 0.0,
};

export function calculateGpa(input: GpaInput): GpaResult {
  const { subjects, scale, customScale } = input;

  const pointsMap =
    scale === "custom" && customScale
      ? customScale
      : scale === "4.33"
      ? WEIGHTED_GRADE_POINTS
      : STANDARD_GRADE_POINTS;

  let totalCredits = 0;
  let totalWeightedPoints = 0;
  const gradeDistribution: Record<string, number> = {};
  const gradePointsList: { name: string; grade: string; credits: number; points: number }[] = [];

  subjects.forEach((subj, idx) => {
    const credits = Math.max(0, subj.credits);
    const grade = subj.grade;
    const pt = pointsMap[grade] !== undefined ? pointsMap[grade] : 0;
    const name = subj.name || `Subject ${idx + 1}`;

    totalCredits += credits;
    totalWeightedPoints += pt * credits;

    // Build distributions (e.g. Group A grades together, B grades, etc., or keep exact)
    const baseGrade = grade.charAt(0); // A, B, C, D, F
    gradeDistribution[baseGrade] = (gradeDistribution[baseGrade] || 0) + 1;

    gradePointsList.push({
      name,
      grade,
      credits,
      points: pt * credits,
    });
  });

  const gpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;

  return {
    gpa,
    totalCredits,
    totalPoints: totalWeightedPoints,
    gradeDistribution,
    gradePointsList,
  };
}
