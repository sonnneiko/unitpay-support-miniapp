import { FC, useEffect, useState } from 'react';
import './AchievementPopup.css';

interface Props {
  emoji: string;
  title: string;
  label?: string;
  description?: string;
  dismissLabel?: string;
  autoClose?: boolean;
  earned?: boolean;
  onClose: () => void;
}

export const AchievementPopup: FC<Props> = ({
  emoji,
  title,
  label = 'Новая ачивка!',
  description,
  dismissLabel = 'Супер!',
  autoClose = true,
  earned = true,
  onClose,
}) => {
  const [hiding, setHiding] = useState(false);

  const dismiss = () => {
    setHiding(true);
    setTimeout(onClose, 280);
  };

  useEffect(() => {
    if (!autoClose) return;
    const timer = setTimeout(dismiss, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`achievement-popup${hiding ? ' achievement-popup--hiding' : ''}`}
      onClick={dismiss}
    >
      <div className={`achievement-popup__card${earned ? '' : ' achievement-popup__card--locked'}`} onClick={e => e.stopPropagation()}>
        <div className={`achievement-popup__emoji${earned ? '' : ' achievement-popup__emoji--locked'}`}>{emoji}</div>
        <p className={`achievement-popup__label${earned ? '' : ' achievement-popup__label--locked'}`}>{label}</p>
        <p className="achievement-popup__title">{title}</p>
        {description && (
          <p className="achievement-popup__description">{description}</p>
        )}
        <button className="achievement-popup__dismiss" onClick={dismiss}>
          {dismissLabel}
        </button>
      </div>
    </div>
  );
};
