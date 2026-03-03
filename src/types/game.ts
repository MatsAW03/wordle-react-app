export type LetterStatus = 'incorrect' | 'misplaced' | 'correct';

export type EvaluatedLetter = {
  letter: string;
  status: LetterStatus;
};
