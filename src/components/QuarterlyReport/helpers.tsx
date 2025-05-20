export const highlightMatches = (value: string, search: string) => {
    if (!search) return value;
    
    const parts = value.split(new RegExp(`(${search})`, 'gi'));

    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === search.toLowerCase() ? 
            <mark key={i} style={{ backgroundColor: '#ffeb3b', padding: '0 2px' }}>{part}</mark> : 
            part
        )}
      </span>
    );
  };