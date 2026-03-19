import { FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignal, initData, backButton } from '@tma.js/sdk-react';

import './OnboardingPage.css';

import stickerHello from '../../../assets/img/stickers/unitpay_cat_image.png';
import stickerUnitpay from '../../../assets/img/stickers/UnitPay 2.png';
import stickerSituations from '../../../assets/img/stickers/UnitPay фон удален.png';
import stickerReady from '../../../assets/img/stickers/UnitPay 4.png';

export const OnboardingPage: FC = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const user = useSignal(initData.user);
  const firstName = user?.first_name ?? '';

  const slides = [
    {
      sticker: stickerHello,
      title: `Привет, ${firstName}!`,
      description: 'Рады видеть тебя здесь.',
    },
    {
      sticker: stickerUnitpay,
      title: 'UnitPay',
      description: 'Учись и тренируй свои навыки.',
    },
    {
      sticker: stickerSituations,
      title: 'Реальные ситуации',
      description: 'Отвечай на вопросы из настоящей рабочей практики.',
    },
    {
      sticker: stickerReady,
      title: 'Ты готов!',
      description: 'Проходи тесты, смотри результат и становись увереннее с каждым разом.',
    },
  ];
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    backButton.hide();
  }, []);

  const finish = () => {
    localStorage.setItem('onboarding_done', '1');
    navigate('/topics');
  };

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      finish();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && current < slides.length - 1) {
        setCurrent(current + 1);
      } else if (diff < 0 && current > 0) {
        setCurrent(current - 1);
      }
    }
    touchStartX.current = null;
  };

  const isLast = current === slides.length - 1;

  return (
    <div className="onboarding">
      <div className="onboarding__header">
        <div className="onboarding__progress">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`onboarding__progress-segment${i <= current ? ' onboarding__progress-segment--active' : ''}`}
            />
          ))}
        </div>
      </div>

      <div
        className="onboarding__slides"
        style={{ transform: `translateX(calc(-${current} * 100vw))` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, i) => (
          <div className="onboarding__slide" key={i}>
            <img
              className="onboarding__sticker onboarding__sticker--mascot"
              src={slide.sticker}
              alt=""
              draggable={false}
            />
            <p className="onboarding__title">{slide.title}</p>
            <p className="onboarding__description">{slide.description}</p>
          </div>
        ))}
      </div>

      <div className="onboarding__footer">
        <button className="onboarding__button" onClick={next}>
          {isLast ? 'Начать' : 'Далее'}
        </button>
        {!isLast && (
          <button className="onboarding__skip" onClick={finish}>
            Пропустить
          </button>
        )}
      </div>
    </div>
  );
};
