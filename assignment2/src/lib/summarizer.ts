// lib/summarizer.ts

// Common English words to ignore.
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
  'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself',
  'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom',
  'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an',
  'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at',
  'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
  'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
]);


export function generateFrequencySummary(text: string, sentenceCount: number = 3): string {
  if (!text) return "";

  // 1. Calculate word frequencies
  const wordFrequencies: { [key: string]: number } = {};
  const cleanWords = text.replace(/[^a-zA-Z\s]/g, "").toLowerCase().split(/\s+/);
  
  for (const word of cleanWords) {
    if (!STOP_WORDS.has(word)) {
      wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
    }
  }

  // 2. Score sentences
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 10);
  const sentenceScores: { sentence: string, score: number, index: number }[] = [];

  sentences.forEach((sentence, index) => {
    let score = 0;
    const wordsInSentence = sentence.replace(/[^a-zA-Z\s]/g, "").toLowerCase().split(/\s+/);
    for (const word of wordsInSentence) {
      if (wordFrequencies[word]) {
        score += wordFrequencies[word];
      }
    }
    sentenceScores.push({ sentence: sentence.trim(), score, index });
  });

  // 3. Get the top N sentences
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, sentenceCount)
    .sort((a, b) => a.index - b.index); // Sort back to original order

  // 4. Join them to form the final summary
  return topSentences.map(s => s.sentence).join('. ') + '.';
}