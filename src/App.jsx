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

    const overwriteData = async (newVideos) => {
      // 1. Delete all existing records
      const { error: deleteError } = await supabase
        .from('search_logs')
        .delete()
        .neq('id', 0); // Or just .delete() without condition
    
      if (deleteError) {
        console.error('Error deleting old data:', deleteError);
        return;
      }
    
      const formattedVideos = newVideos.map((video, index) => ({
        id: index,
        video_id: video.id.videoId,
      }));
    
      const { error: insertError } = await supabase
        .from('search_logs')
        .upsert(formattedVideos, {onConflict: 'id'});
    
      if (insertError) {
        console.error('Error inserting new data:', insertError);
      }
    };
    
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

    setPrevEndDate(endDate);
    setPrevStartDate(startDate);
    
    await overwriteData(res.data.items);

    if (res.data.items.length > 0) {
      const randomIndex = Math.floor(Math.random() * videos.length);
      const getSupabaseLink = async () => {
        const {data, error } = await supabase.from('search_logs').select('video_id').eq('id', randomIndex)
        
        if (error) {
          console.error('Error fetching log:', error);
        }

        return data[0].video_id;
      };

      const videoLink = await getSupabaseLink();
      setDisplayVid(videoLink);
      console.log(displayVid);
    } else if (res.data.items.length == 0) {
      return 'No Videos Found!'
    }

  };




  const handleSubmit = async(e) => {
    e.preventDefault();

    if (searchTerm.trim() !== prevTerm.trim() || 
    formatDate(endDate) !== prevEndDate || 
    formatDate(startDate) !== prevStartDate) {
      searchYT(searchTerm, formatDate(endDate), formatDate(startDate));
    } else {
      if (videos.length > 0) {
        const randomIndex = Math.floor(Math.random() * videos.length);

        const getSupabaseLink = async () => {
          const {data, error } = await supabase.from('search_logs').select('video_id').eq('id', randomIndex)
          
          if (error) {
            console.error('Error fetching log:', error);
          }

          return data[0].video_id;
        };

        const videoLink = await getSupabaseLink();
        setDisplayVid(videoLink);
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
              src={`https://www.youtube.com/embed/${displayVid}`}
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