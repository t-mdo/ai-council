export type JudgeState = {
  status: "initial" | "streaming" | "done" | "error";
  fullAnswer: string | null;
  answer: string | null;
  answerColor: string | null;
  modelId: string;
  modelName: string;
  modelImagePath: string;
  completedAt: string | null;
};

export type Consultation = {
  publicId: string;
  query: string;
  responses: Array<JudgeState>;
  createdAt: Date;
};
