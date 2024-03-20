import React, { useRef } from 'react';
import YouTube from 'react-youtube';

function VideoPlayer({videoId}) {
  const playerRef = useRef(null);
  const videoid='kHSFZq2YJoazz-pW'
  const opts = {
    height: '420',
    width: '100%',
    playerVars: {
      
      autoplay: 1,
    },
  };

  const handleReady = (event) => {
    
    playerRef.current = event.target;
    playerRef.current.pauseVideo();
  };

   const actualVideoId = typeof videoId === 'object' ? videoId.id : videoId;
   console.log(actualVideoId);
  return <YouTube videoId={videoId} opts={opts} onReady={handleReady} />;
}

export default VideoPlayer;
