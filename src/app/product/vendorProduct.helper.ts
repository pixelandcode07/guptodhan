export const prepareWords = (searchTerm: string): string[] => {
  return searchTerm
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 1); // ১ অক্ষরের ফালতু ওয়ার্ড ইগনোর করবে
};

export const buildTitleMatch = (words: string[]) => {
  if (!words.length) return {};
  return {
    $and: words.map((w) => ({
      productTitle: { $regex: new RegExp(w, "i") }, // \b সরিয়ে শুধু regex দেওয়া হলো যাতে আংশিক শব্দেও কাজ করে
    })),
  };
};

export const buildDescriptionMatch = (words: string[]) => {
  if (!words.length) return {};
  return {
    $and: words.map((w) => ({
      shortDescription: { $regex: new RegExp(w, "i") },
    })),
  };
};

export const buildTagOrRegex = (words: string[]): RegExp => {
  if (!words.length) return /a^/; // Impossible regex if empty
  const escapedWords = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(escapedWords.join("|"), "i"); // যেকোনো একটি শব্দ মিললেই true (OR Logic)
};

