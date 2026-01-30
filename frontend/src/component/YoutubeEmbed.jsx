import React from 'react';
import '../styles/component/YoutubeEmbed.css';

const YouTubeEmbed = ({ youtubeId, title, description, startTime, endTime }) => {
  if (!youtubeId) return null;

 
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}${startTime ? `?start=${startTime}` : ''}${endTime ? `${startTime ? '&' : '?'}end=${endTime}` : ''}`;

  return (
    <div className="youtube-embed">
      <div className="video-header">
        <h3>
          <span className="video-icon">🎬</span>
          {title || 'Video Tutorial'}
        </h3>
        {description && (
          <p className="video-description">{description}</p>
        )}
      </div>

      <div className="video-container">
        <div className="video-wrapper">
          <iframe
            src={embedUrl}
            title={title || "YouTube video player"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="video-footer">
        <a
          href={`https://www.youtube.com/watch?v=${youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="video-link"
        >
          📺 Watch on YouTube
        </a>
        {(startTime || endTime) && (
          <div className="video-timing-info">
            {startTime && (
              <span>Starts at: {formatTime(startTime)}</span>
            )}
            {endTime && (
              <span>Ends at: {formatTime(endTime)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default YouTubeEmbed;