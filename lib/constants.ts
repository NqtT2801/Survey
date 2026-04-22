export const QUESTIONS_PER_PHASE = 10;
export const ANSWER_CHOICES = ["A", "B", "C"] as const;
export type AnswerChoice = (typeof ANSWER_CHOICES)[number];
export type Group = "Control" | "Treatment";
export type QuestionGroup = "Control" | "Treatment" | "Shared";

export const KNOWLEDGE_RATING_QUESTION =
  "Bạn cảm thấy nội dung của bộ câu hỏi hôm nay có nằm trong phạm vi kiến thức của mình không?\nChọn từ 1 tới 5: 1-Hoàn toàn nằm ngoài;  2-Khá nằm ngoài;  3-Trung lập;  4-Khá nằm trong;  5-Hoàn toàn nằm trong.";
