import React from 'react';
import Select from 'react-select';
import './MultiSelect.css';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[] | null) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ 
  options, 
  selected, 
  onChange, 
  placeholder = 'Фильтр'
}) => {
  return (
    <div className='multi-select-container'>
        {selected.length === 0 ? <div className='multi-select-placeholder'>{placeholder}</div> : <div className='multi-select-placeholder-minimized'>{placeholder}</div> }
        <Select
            isMulti
            options={options.map(option => ({ value: option, label: option }))}
            value={selected.map(s => ({ value: s, label: s }))}
            onChange={(selectedOptions) => {
                onChange(selectedOptions ? selectedOptions.map(option => option.value) : null);
            }}
            placeholder=''
            className='multi-select'
            classNamePrefix='select'
            noOptionsMessage={() => 'Нет вариантов'}
        />
    </div>
  );
};