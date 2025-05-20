import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onClear }) => (
  <div style={{ 
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }}>
    <div style={{ position: 'relative', flex: 1 }}>
      <input
        placeholder="Поиск по всем колонкам..."
        style={{ 
          padding: '10px',
          width: '-webkit-fill-available',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
        value={value}
        onChange={onChange}
      />
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
            color: '#999'
          }}
        >
          ×
        </button>
      )}
    </div>
  </div>
);