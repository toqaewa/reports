const highlightMatches = (value: string, search: string) => {
    if (!search) return value;
    
    const parts = value.split(new RegExp(`(${search})`, 'gi'));

    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === search.toLowerCase() ? 
            <mark key={i} className="highlight-matches">{part}</mark> : 
            part
        )}
      </span>
    );
};

export default highlightMatches;