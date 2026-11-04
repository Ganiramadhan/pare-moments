import type { SentenceItem } from '../types/practice'

// Sentences for the sentence builder: twelve useful ones, from short to long. The Indonesian line
// is the hint; the English sentence is what the visitor builds, word by word. Keep every English
// sentence different, and end it with a full stop or a question mark.
export const sentences: SentenceItem[] = [
  {
    english: 'We study English every morning.',
    indonesian: 'Kami belajar bahasa Inggris setiap pagi.',
  },
  { english: 'I live in a small village.', indonesian: 'Aku tinggal di desa kecil.' },
  { english: 'What time does the class start?', indonesian: 'Jam berapa kelas dimulai?' },
  {
    english: 'Could you please repeat that sentence?',
    indonesian: 'Bisakah kamu mengulangi kalimat itu?',
  },
  {
    english: 'I have lived in Pare for one week.',
    indonesian: 'Aku sudah tinggal di Pare selama satu minggu.',
  },
  {
    english: 'It is important to speak English every day.',
    indonesian: 'Penting untuk berbicara bahasa Inggris setiap hari.',
  },
  {
    english: 'Where can I buy a notebook near here?',
    indonesian: 'Di mana aku bisa membeli buku catatan di dekat sini?',
  },
  {
    english: 'She is going to give a speech tomorrow.',
    indonesian: 'Dia akan memberikan pidato besok.',
  },
  {
    english: 'I was nervous, but I finished my presentation.',
    indonesian: 'Aku gugup, tetapi aku menyelesaikan presentasiku.',
  },
  {
    english: 'If it rains tomorrow, we will study in the dormitory.',
    indonesian: 'Jika besok hujan, kami akan belajar di asrama.',
  },
  {
    english: 'My teacher said that I should practice speaking every day.',
    indonesian: 'Guruku berkata bahwa aku harus berlatih berbicara setiap hari.',
  },
  {
    english: 'After we finished the lesson, we walked to the market together.',
    indonesian: 'Setelah kami menyelesaikan pelajaran, kami berjalan ke pasar bersama.',
  },
]
