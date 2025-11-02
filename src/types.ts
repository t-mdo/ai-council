export type Judgment = {
  status: "initial" | "streaming" | "done" | "error";
  fullAnswer: string | null;
  fullAnswerPreview?: string | null;
  answer: string | null;
  answerColor: string | null;
  completedAt: string | null;
};

export type Consultation = {
  publicId: string;
  query: string;
  createdAt: Date;
};
