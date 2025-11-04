export type Judge = {
  modelId: string;
  modelName: string;
  modelImagePath: string;
};

export type Judgment = {
  status: "initial" | "streaming" | "done" | "error";
  fullAnswer: string | null;
  fullAnswerPreview?: string | null;
  answer: string | null;
  answerColor: string | null;
  completedAt: Date | null;
  judgeModelId: string;
};

export type Consultation = {
  publicId: string;
  query: string;
  createdAt: Date;
};
