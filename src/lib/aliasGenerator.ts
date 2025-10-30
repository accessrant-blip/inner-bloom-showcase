const adjectives = [
  "Calm", "Kind", "Gentle", "Peaceful", "Serene", "Warm", "Soft", "Bright",
  "Hopeful", "Caring", "Thoughtful", "Wise", "Brave", "Strong", "Quiet",
  "Creative", "Mindful", "Tender", "Sweet", "Radiant"
];

const nouns = [
  "Soul", "Heart", "Star", "Wave", "Light", "Moon", "Sun", "Cloud",
  "Flower", "Tree", "River", "Mountain", "Breeze", "Dawn", "Spirit",
  "Voice", "Path", "Journey", "Dream", "Phoenix"
];

export const generateAlias = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 100);
  
  return `${adjective}${noun}${number}`;
};
