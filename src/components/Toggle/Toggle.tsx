import React, { useState } from 'react';
import './Toggle.css';

interface ToggleProps {
  initialValue?: boolean;
  onChange?: (isActive: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  initialValue = false,
  onChange,
  disabled = false,
  className = '',
  label = '',
}) => {
  const [isActive, setIsActive] = useState(initialValue);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isActive;
    setIsActive(newValue);
    onChange?.(newValue);
  };

  const toggleClasses = [
    'toggle',
    isActive ? 'toggle--active' : '',
    disabled ? 'toggle--disabled' : '',
    className,
  ].join(' ').trim();

  const knobClasses = [
    'toggle__knob',
    isActive ? 'toggle__knob--active' : '',
  ].join(' ').trim();

  const labelClasses = [
    'toggle__label',
    isActive ? 'toggle__label--active' : '',
  ].join(' ').trim();

  return (
    <div className="toggle-container">
      <button
        type="button"
        className={toggleClasses}
        onClick={handleToggle}
        disabled={disabled}
        aria-pressed={isActive}
      >
        <span className={knobClasses} />
      </button>
      {label && <span className={labelClasses}>{label}</span>}
    </div>
  );
};

export default Toggle;