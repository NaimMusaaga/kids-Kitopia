import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaTrophy } from 'react-icons/fa';
import { CATEGORIES, QUIZ_LENGTH, buildQuiz, starsFor } from '../utils/quiz';
import { useLanguage } from '../i18n/language-context';
import './QuizGame.css';

const NEXT_DELAY = 1100;

function loadBest() {
  const best = {};
  for (const c of CATEGORIES) {
    try { best[c.id] = Number(localStorage.getItem(`quizBest:${c.id}`)) || 0; } catch { best[c.id] = 0; }
  }
  return best;
}

function saveBest(category, score) {
  try { localStorage.setItem(`quizBest:${category}`, String(score)); } catch { /* تجاهل */ }
}

function Visual({ visual, t }) {
  if (visual.type === 'color') {
    return <div className="quiz-color" style={{ background: visual.hex }} role="img" aria-label={t('quiz.colorAria')} />;
  }
  if (visual.type === 'emojis') {
    return (
      <div className="quiz-emojis" role="img" aria-label={t('quiz.itemsAria', { n: visual.count })}>
        {Array.from({ length: visual.count }, (_, i) => <span key={i}>{visual.emoji}</span>)}
      </div>
    );
  }
  return <div className="quiz-sum" dir="ltr">{visual.text}</div>;
}

export default function QuizGame() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState('menu'); // menu | playing | done
  const [category, setCategory] = useState('mix');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(loadBest);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const start = (cat) => {
    clearTimeout(timer.current);
    setCategory(cat);
    setQuestions(buildQuiz(cat));
    setIndex(0);
    setScore(0);
    setPicked(null);
    setPhase('playing');
  };

  const answer = (option) => {
    if (picked !== null) return;
    const q = questions[index];
    const correct = option.value === q.answer;
    const newScore = correct ? score + 1 : score;
    setPicked(option.value);
    if (correct) setScore(newScore);

    timer.current = setTimeout(() => {
      if (index + 1 >= questions.length) {
        if (newScore > best[category]) {
          saveBest(category, newScore);
          setBest((b) => ({ ...b, [category]: newScore }));
        }
        setPhase('done');
      } else {
        setIndex(index + 1);
        setPicked(null);
      }
    }, NEXT_DELAY);
  };

  const question = questions[index];
  const stars = starsFor(score);

  return (
    <div className="quiz-page">
      <div className="container quiz-shell">
        <Link to="/games" className="quiz-back"><FaArrowLeft className="flip-rtl" /> {t('games.back')}</Link>

        {phase === 'menu' && (
          <div className="quiz-panel quiz-menu">
            <h1>{t('quiz.title')}</h1>
            <p>{t('quiz.sub', { n: QUIZ_LENGTH })}</p>
            <div className="quiz-cats">
              {CATEGORIES.map((c) => (
                <button key={c.id} className="quiz-cat" onClick={() => start(c.id)}>
                  <span className="quiz-cat-emoji">{c.emoji}</span>
                  <strong>{t(`quiz.cat.${c.id}`)}</strong>
                  <span>{t(`quiz.cat.${c.id}Desc`)}</span>
                  <span className="quiz-cat-best"><FaTrophy /> {t('quiz.best', { best: best[c.id], total: QUIZ_LENGTH })}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'playing' && question && (
          <div className="quiz-panel">
            <div className="quiz-top">
              <span>{t('quiz.question', { i: index + 1, n: questions.length })}</span>
              <span className="quiz-score"><FaStar /> {score}</span>
            </div>
            <div className="quiz-progress" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={index + 1}>
              <div style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
            </div>

            <h2 className="quiz-prompt">{t(question.prompt)}</h2>
            <Visual visual={question.visual} t={t} />

            <div className="quiz-options">
              {question.options.map((o) => {
                let state = '';
                if (picked !== null) {
                  if (o.value === question.answer) state = ' correct';
                  else if (o.value === picked) state = ' wrong';
                }
                return (
                  <button key={o.label} className={`quiz-option${state}`} onClick={() => answer(o)} disabled={picked !== null}>
                    {o.translate ? t(o.label) : o.label}
                  </button>
                );
              })}
            </div>

            <p className="quiz-feedback" aria-live="polite">
              {picked === null ? ' ' : picked === question.answer ? t('quiz.correct') : t('quiz.wrong')}
            </p>
          </div>
        )}

        {phase === 'done' && (
          <div className="quiz-panel quiz-result">
            <div className="quiz-stars" aria-label={t('quiz.starsAria', { n: stars })}>
              {[1, 2, 3].map((n) => <FaStar key={n} className={n <= stars ? 'on' : ''} />)}
            </div>
            <h2>{score >= 9 ? t('quiz.amazing') : score >= 6 ? t('quiz.wellDone') : t('quiz.niceTry')}</h2>
            <p>{t('quiz.resultText', { score, n: QUIZ_LENGTH })}</p>
            <div className="quiz-result-actions">
              <button className="btn btn-sun btn-lg" onClick={() => start(category)}>{t('quiz.again')}</button>
              <button className="btn btn-brand btn-lg" onClick={() => setPhase('menu')}>{t('quiz.categories')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
