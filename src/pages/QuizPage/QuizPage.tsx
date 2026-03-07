import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { backButton } from '@tma.js/sdk-react';

import { topicsData } from '@/data/questions';
import './QuizPage.css';

const LETTERS = ['А', 'Б', 'В', 'Г'];

type AnswerState = 'idle' | 'correct' | 'wrong';

export const QuizPage: FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const topic = topicsData.find(t => t.id === topicId);
  const questions = topic?.questions ?? [];

  useEffect(() => {
    backButton.show();
    return backButton.onClick(() => navigate('/topics'));
  }, [navigate]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];

  const handleSelect = (optionIndex: number) => {
    if (answerState === 'correct') return;

    setSelectedIndex(optionIndex);

    if (optionIndex === question.correctIndex) {
      setAnswerState('correct');
    } else {
      setAnswerState('wrong');
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedIndex(null);
      setAnswerState('idle');
    } else {
      setFinished(true);
    }
  };

  const getOptionClass = (i: number) => {
    const classes = ['quiz__option'];
    if (answerState === 'correct' && i === question.correctIndex) {
      classes.push('quiz__option--correct');
    } else if (answerState === 'wrong' && i === selectedIndex) {
      classes.push('quiz__option--wrong');
    } else if (answerState === 'correct' && i !== question.correctIndex) {
      classes.push('quiz__option--locked');
    }
    return classes.join(' ');
  };

  if (!topic || questions.length === 0) {
    return (
      <div className="quiz">
        <div className="quiz__finish">
          <p className="quiz__finish-emoji">🚧</p>
          <p className="quiz__finish-title">Вопросы скоро появятся</p>
          <p className="quiz__finish-subtitle">Этот раздел ещё в разработке</p>
        </div>
        <div className="quiz__footer">
          <button className="quiz__next" onClick={() => navigate('/topics')}>К темам</button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="quiz">
        <div className="quiz__finish">
          <p className="quiz__finish-emoji">🎉</p>
          <p className="quiz__finish-title">Раздел пройден!</p>
          <p className="quiz__finish-subtitle">{topic.title}</p>
        </div>
        <div className="quiz__footer">
          <button className="quiz__next" onClick={() => navigate('/topics')}>К темам</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz__header">
        <div className="quiz__progress-row">
          <div className="quiz__progress-bar">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`quiz__progress-segment${
                  i < currentIndex
                    ? ' quiz__progress-segment--done'
                    : i === currentIndex
                    ? ' quiz__progress-segment--current'
                    : ''
                }`}
              />
            ))}
          </div>
          <span className="quiz__progress-label">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      <div className="quiz__body">
        <p className="quiz__question">{question.text}</p>

        <div className="quiz__options">
          {question.options.map((option, i) => (
            <button
              key={i}
              className={getOptionClass(i)}
              onClick={() => handleSelect(i)}
            >
              <span className="quiz__option-letter">{LETTERS[i]}</span>
              {option}
            </button>
          ))}
        </div>

        {answerState === 'correct' && (
          <div className="quiz__feedback quiz__feedback--correct">
            ✅ Верно!
          </div>
        )}
        {answerState === 'wrong' && (
          <div className="quiz__feedback quiz__feedback--wrong">
            ❌ Неверно — попробуй ещё раз
          </div>
        )}
      </div>

      {answerState === 'correct' && (
        <div className="quiz__footer">
          <button className="quiz__next" onClick={handleNext}>
            {currentIndex < questions.length - 1 ? 'Далее →' : 'Завершить'}
          </button>
        </div>
      )}
    </div>
  );
};
