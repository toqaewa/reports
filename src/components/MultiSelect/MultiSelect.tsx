import React from 'react';
import Select from 'react-select';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ options, selected, onChange }) => {
  return (
    <Select
      isMulti
      options={options.map(option => ({ value: option, label: option }))}
      value={selected.map(s => ({ value: s, label: s }))}
      onChange={(selectedOptions) => 
        onChange(selectedOptions.map(option => option.value))
      }
      placeholder="Фильтр..."
    />
  );
};