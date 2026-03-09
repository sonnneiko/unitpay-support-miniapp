import { FC, useEffect, useState } from 'react';
import './AchievementPopup.css';

interface Props {
  emoji: string;
  title: string;
  onClose: () => void;
}

export const AchievementPopup: FC<Props> = ({ emoji, title, onClose }) => {
  const [hiding, setHiding] = useState(false);

  const dismiss = () => {
    setHiding(true);
    setTimeout(onClose, 280);
  };

  useEffect(() => {
    const timer = setTimeout(dismiss, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`achievement-popup${hiding ? ' achievement-popup--hiding' : ''}`}
      onClick={dismiss}
    >
      <div className="achievement-popup__card" onClick={e => e.stopPropagation()}>
        <div className="achievement-popup__emoji">{emoji}</div>
        <p className="achievement-popup__label">Новая ачивка!</p>
        <p className="achievement-popup__title">{title}</p>
        <button className="achievement-popup__dismiss" onClick={dismiss}>
          Супер!
        </button>
      </div>
    </div>
  );
};
