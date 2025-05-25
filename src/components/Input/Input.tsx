import React, { useState, useRef } from "react";
import "./Input.css";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({ 
  value, 
  onChange, 
  onClear, 
  placeholder = 'Поиск',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  return (
        <div className="input-container">
          <div className="input-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 10.5C3.75 6.77208 6.77208 3.75 10.5 3.75C14.2279 3.75 17.25 6.77208 17.25 10.5C17.25 14.2279 14.2279 17.25 10.5 17.25C6.77208 17.25 3.75 14.2279 3.75 10.5ZM10.5 2.25C5.94365 2.25 2.25 5.94365 2.25 10.5C2.25 15.0563 5.94365 18.75 10.5 18.75C12.5081 18.75 14.3487 18.0325 15.7793 16.84L20.4697 21.5303C20.7626 21.8232 21.2374 21.8232 21.5303 21.5303C21.8232 21.2374 21.8232 20.7626 21.5303 20.4697L16.84 15.7793C18.0325 14.3487 18.75 12.5081 18.75 10.5C18.75 5.94365 15.0563 2.25 10.5 2.25Z" fill="currentColor"/>
            </svg>
          </div>
          <input
            ref={inputRef}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="input-field"
          />
          <label
            className={`placeholder-label ${isFocused || value ? "focused" : ""}`}
            onClick={() => inputRef.current?.focus()}
          >
            {placeholder}
          </label>
        {value && (
          <button
            onClick={onClear}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#777677'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M6.87348 5.81282C6.58058 5.51992 6.10571 5.51992 5.81282 5.81282C5.51992 6.10571 5.51992 6.58058 5.81282 6.87348L10.9393 12L5.81281 17.1265C5.51992 17.4194 5.51992 17.8943 5.81281 18.1872C6.1057 18.4801 6.58058 18.4801 6.87347 18.1872L12 13.0607L17.1265 18.1872C17.4194 18.4801 17.8943 18.4801 18.1872 18.1872C18.4801 17.8943 18.4801 17.4194 18.1872 17.1265L13.0607 12L18.1872 6.87348C18.4801 6.58058 18.4801 6.10571 18.1872 5.81282C17.8943 5.51992 17.4194 5.51992 17.1265 5.81282L12 10.9393L6.87348 5.81282Z" fill="currentColor"/>
            </svg>
          </button>
        )}
      </div>
  );
};
