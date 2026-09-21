// مولّد أسئلة لعبة الأرقام والألوان (دوال نقية، تُستدعى عند بدء الجولة فقط)
// النصوص هنا مفاتيح ترجمة؛ الواجهة تترجمها حسب لغة المستخدم.

export const QUIZ_LENGTH = 10;

export const CATEGORIES = [
  { id: 'mix', emoji: '🎲' },
  { id: 'numbers', emoji: '🔢' },
  { id: 'colors', emoji: '🎨' },
];

const COLORS = [
  { key: 'red', hex: '#e63946' },
  { key: 'blue', hex: '#1d7cf2' },
  { key: 'yellow', hex: '#ffd23f' },
  { key: 'green', hex: '#2fbf71' },
  { key: 'orange', hex: '#ff8c1a' },
  { key: 'purple', hex: '#8e44ad' },
  { key: 'pink', hex: '#ff6fa5' },
  { key: 'brown', hex: '#8d5a2b' },
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
    prompt: 'quiz.qCount',
    visual: { type: 'emojis', emoji: pick(OBJECTS), count },
    options: numberOptions(count),
    answer: count,
  };
}

function addQuestion() {
  const a = randInt(1, 6);
  const b = randInt(1, 10 - a);
  return {
    prompt: 'quiz.qAdd',
    visual: { type: 'text', text: `${a} + ${b} = ?` },
    options: numberOptions(a + b),
    answer: a + b,
  };
}

function colorQuestion() {
  const [correct, ...others] = shuffle(COLORS);
  return {
    prompt: 'quiz.qColor',
    visual: { type: 'color', hex: correct.hex },
    options: shuffle([correct, ...others.slice(0, 3)]).map((c) => ({ label: `color.${c.key}`, value: c.key, translate: true })),
    answer: correct.key,
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
