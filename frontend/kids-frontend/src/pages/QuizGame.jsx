import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaTrophy } from 'react-icons/fa';
import { CATEGORIES, QUIZ_LENGTH, buildQuiz, starsFor } from '../utils/quiz';
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

function Visual({ visual }) {
  if (visual.type === 'color') {
    return <div className="quiz-color" style={{ background: visual.hex }} role="img" aria-label="Renk" />;
  }
  if (visual.type === 'emojis') {
    return (
      <div className="quiz-emojis" role="img" aria-label={`${visual.count} tane ${visual.emoji}`}>
        {Array.from({ length: visual.count }, (_, i) => <span key={i}>{visual.emoji}</span>)}
      </div>
    );
  }
  return <div className="quiz-sum">{visual.text}</div>;
}

export default function QuizGame() {
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
    const question = questions[index];
    const correct = option.value === question.answer;
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
    <div className="game-page quiz-page">
      <div className="container quiz-shell">
        <Link to="/games" className="quiz-back"><FaArrowLeft /> Oyunlar</Link>

        {phase === 'menu' && (
          <div className="quiz-panel quiz-menu">
            <h1>🧠 Sayı ve Renk Yarışması</h1>
            <p>{QUIZ_LENGTH} soruyu doğru cevapla, yıldızları topla!</p>
            <div className="quiz-cats">
              {CATEGORIES.map((c) => (
                <button key={c.id} className="quiz-cat" onClick={() => start(c.id)}>
                  <span className="quiz-cat-emoji">{c.emoji}</span>
                  <strong>{c.title}</strong>
                  <span>{c.desc}</span>
                  <span className="quiz-cat-best"><FaTrophy /> En iyi: {best[c.id]}/{QUIZ_LENGTH}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'playing' && question && (
          <div className="quiz-panel">
            <div className="quiz-top">
              <span>Soru {index + 1}/{questions.length}</span>
              <span className="quiz-score"><FaStar /> {score}</span>
            </div>
            <div className="quiz-progress" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={index + 1}>
              <div style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
            </div>

            <h2 className="quiz-prompt">{question.prompt}</h2>
            <Visual visual={question.visual} />

            <div className="quiz-options">
              {question.options.map((o) => {
                let state = '';
                if (picked !== null) {
                  if (o.value === question.answer) state = ' correct';
                  else if (o.value === picked) state = ' wrong';
                }
                return (
                  <button key={o.label} className={`quiz-option${state}`} onClick={() => answer(o)} disabled={picked !== null}>
                    {o.label}
                  </button>
                );
              })}
            </div>

            <p className="quiz-feedback" aria-live="polite">
              {picked === null ? ' ' : picked === question.answer ? 'Harika! 🎉' : 'Olsun, bir dahaki sefere! 💪'}
            </p>
          </div>
        )}

        {phase === 'done' && (
          <div className="quiz-panel quiz-result">
            <div className="quiz-stars" aria-label={`${stars} yıldız`}>
              {[1, 2, 3].map((n) => <FaStar key={n} className={n <= stars ? 'on' : ''} />)}
            </div>
            <h2>{score >= 9 ? 'Muhteşem!' : score >= 6 ? 'Aferin sana!' : 'Güzel deneme!'}</h2>
            <p>{QUIZ_LENGTH} sorunun <strong>{score}</strong> tanesini doğru bildin.</p>
            <div className="quiz-result-actions">
              <button className="btn btn-sun btn-lg" onClick={() => start(category)}>Tekrar Oyna</button>
              <button className="btn btn-brand btn-lg" onClick={() => setPhase('menu')}>Kategoriler</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
