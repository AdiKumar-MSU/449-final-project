import React, { useState } from 'react';

function YoutubeSearch() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const apiKey = 'AIzaSyBXj-YM_wRez3b063oxWhk924kIXMP0Ff0';
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=basketball&key=${apiKey}&publishedAfter=${startDate}T00:00:00Z&publishedBefore=${endDate}T23:59:59Z`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setResults(data.items);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
 
  return (
    <div>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {results.map((item) => (
          <li key={item.id.videoId}>
             <img src={item.snippet.thumbnails.high.url} alt="Thumbnail" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default YoutubeSearch;

