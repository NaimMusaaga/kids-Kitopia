// مولّد أسئلة لعبة الأرقام والألوان (دوال نقية، تُستدعى عند بدء الجولة فقط)

export const QUIZ_LENGTH = 10;

export const CATEGORIES = [
  { id: 'mix', title: 'Karışık', emoji: '🎲', desc: 'Sayılar ve renkler bir arada!' },
  { id: 'numbers', title: 'Sayılar', emoji: '🔢', desc: 'Say ve topla.' },
  { id: 'colors', title: 'Renkler', emoji: '🎨', desc: 'Renkleri tanı.' },
];

const COLORS = [
  { name: 'Kırmızı', hex: '#e63946' },
  { name: 'Mavi', hex: '#1d7cf2' },
  { name: 'Sarı', hex: '#ffd23f' },
  { name: 'Yeşil', hex: '#2fbf71' },
  { name: 'Turuncu', hex: '#ff8c1a' },
  { name: 'Mor', hex: '#8e44ad' },
  { name: 'Pembe', hex: '#ff6fa5' },
  { name: 'Kahverengi', hex: '#8d5a2b' },
];

const OBJECTS = ['🍎', '⭐', '🎈', '🐟', '🚗', '🌸', '🍓', '🐥'];

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (list) => list[randInt(0, list.length - 1)];

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 4 خيارات أرقام: الصحيح + 3 مشتتات قريبة منه
function numberOptions(answer) {
  const pool = new Set([answer]);
  while (pool.size < 4) {
    const candidate = answer + randInt(-3, 3);
    if (candidate >= 0 && candidate <= 12) pool.add(candidate);
  }
  return shuffle([...pool]).map((n) => ({ label: String(n), value: n }));
}

function countQuestion() {
  const count = randInt(1, 10);
  return {
    prompt: 'Kaç tane var?',
    visual: { type: 'emojis', emoji: pick(OBJECTS), count },
    options: numberOptions(count),
    answer: count,
  };
}

function addQuestion() {
  const a = randInt(1, 6);
  const b = randInt(1, 10 - a);
  return {
    prompt: 'Toplamı kaçtır?',
    visual: { type: 'text', text: `${a} + ${b} = ?` },
    options: numberOptions(a + b),
    answer: a + b,
  };
}

function colorQuestion() {
  const [correct, ...others] = shuffle(COLORS);
  return {
    prompt: 'Bu renk hangisi?',
    visual: { type: 'color', hex: correct.hex },
    options: shuffle([correct, ...others.slice(0, 3)]).map((c) => ({ label: c.name, value: c.name })),
    answer: correct.name,
  };
}

const MAKERS = {
  numbers: [countQuestion, addQuestion],
  colors: [colorQuestion],
  mix: [countQuestion, addQuestion, colorQuestion],
};

export function buildQuiz(category) {
  const makers = MAKERS[category] || MAKERS.mix;
  return Array.from({ length: QUIZ_LENGTH }, () => pick(makers)());
}

export function starsFor(score) {
  if (score >= 9) return 3;
  if (score >= 6) return 2;
  return score >= 1 ? 1 : 0;
}
