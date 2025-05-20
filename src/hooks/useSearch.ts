import { useState, useEffect } from 'react';

export const useSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setGlobalFilter(searchValue);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchValue]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);
  };

  const handleClearSearch = () => {
    setGlobalFilter('');
    setSearchValue('');
  };

  return {
    searchValue,
    globalFilter,
    setSearchValue,
    handleSearchChange,
    handleClearSearch
  };
};