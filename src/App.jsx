import './index.css'
import { useState, useEffect } from 'react'
import './App.css'
import Axios from 'axios'
import { supabase } from './supabase';

const API_KEY = import.meta.env.VITE_API_KEY;

function KeywordSearch() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [prevTerm, setPrevTerm] = useState('');
  const [displayVid, setDisplayVid] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [prevStartDate, setPrevStartDate] = useState('');
  const [prevEndDate, setPrevEndDate] = useState('');
  
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
          maxResults: 6,
          key: API_KEY,
          publishedAfter: startDate,
          publishedBefore: endDate
        }
      }
    );
    setVideos(res.data.items);
    setPrevTerm(searchTerm);

    setPrevEndDate(endDate);
    setPrevStartDate(startDate);
    
    if (res.data.items.length > 0) {
      const randomIndex = Math.floor(Math.random() * res.data.items.length);
      const selectedVideo = res.data.items[randomIndex];
      setDisplayVid(selectedVideo);

      await supabase.from('search_logs').insert([
        { video_id: selectedVideo.id.videoId }
      ]);
    } else if (res.data.items.length == 0) {
      return 'No Videos Found!'
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchTerm.trim() !== prevTerm.trim() || 
    formatDate(endDate) !== prevEndDate || 
    formatDate(startDate) !== prevStartDate) {
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
          <div className="datebuttons">
            <input type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            />
            <input type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            />
          </div>
            
            <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

function App() {
  return (
    <>
      <div className="page">
        <header className="header">
          <h1 className = "title">CYTC</h1>
          <h2 className = "yellow">Custom Youtube Cinema</h2>
        </header>
        <div className="body">
          <KeywordSearch></KeywordSearch>
        </div>
      </div>
    </>  
  )
}

export { KeywordSearch };
export default App;



