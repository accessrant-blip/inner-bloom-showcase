const safetyKeywords = [
  "end life", "suicide", "kill myself", "want to die", "end it all",
  "harm myself", "self harm", "cut myself", "overdose", "end my life",
  "no reason to live", "better off dead", "suicide plan"
];

export const checkSafetyKeywords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return safetyKeywords.some(keyword => lowerText.includes(keyword));
};
