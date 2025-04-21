import { useState, useEffect } from 'react'
import './App.css'
import Axios from 'axios'


function KeywordSearch() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [prevTerm, setPrevTerm] = useState('');
  const [displayVid, setDisplayVid] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const formatDate = (dateString) => {
    return dateString ? `${dateString}T00:00:00Z` : null;
  };

  const searchYT = async (searchTerm, endDate, startDate) => {

    const res = await Axios.get(
      'https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: searchTerm,
          type: 'video',
          maxResults: 20,
          key: API_KEY,
          publishedAfter: startDate,
          publishedBefore: endDate
        }
      }
    );
    setVideos(res.data.items);
    setPrevTerm(searchTerm);
    
    if (res.data.items.length > 0) {
      const randomIndex = Math.floor(Math.random() * res.data.items.length);
      setDisplayVid(res.data.items[randomIndex]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() != prevTerm.trim()) {
      searchYT(searchTerm, formatDate(endDate), formatDate(startDate));
    } else {
      if (videos.length > 0) {
        const randomIndex = Math.floor(Math.random() * videos.length);
        setDisplayVid(videos[randomIndex]);
      }
    }
  };

  return(
    <>
      <div className="videoSearch">
        <form onSubmit={handleSubmit}>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          
          <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search YouTube"
          />

          <button type="submit">
            Search
          </button>
        </form>
        

        <div className="video-list">
          {videos.length > 0 && (
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${displayVid.id.videoId}`}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </>
  );
};


export default KeywordSearch;