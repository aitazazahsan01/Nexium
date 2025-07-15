// lib/translator.ts

const urduDictionary: { [key: string]: string } = {
  the: 'دی',
  blog: 'بلاگ',
  post: 'پوسٹ',
  is: 'ہے',
  about: 'کے بارے میں',
  this: 'یہ',
  summary: 'خلاصہ',
  a: 'ایک',
  and: 'اور',
  we: 'ہم',
  are: 'ہیں',
  learning: 'سیکھ رہے',
  nextjs: 'نیکسٹ جے ایس',
  with: 'کے ساتھ',
  supabase: 'سپابیس',
  mongodb: 'مونگوڈی بی',
  // Add more common words as needed
};

export function translateToUrdu(text: string): string {
  const words = text.toLowerCase().replace(/[.,]/g, '').split(' ');
  const translatedWords = words.map(word => urduDictionary[word] || word);
  return translatedWords.join(' ');
}