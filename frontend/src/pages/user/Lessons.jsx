// pages/Lessons.jsx 
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllLessons } from "../../api/lessons";
import LessonNavigation from "../../component/LessonNavigation";

import "../../styles/user/Lessons.css";

// Icons for different lesson types
import { 
  FaCss3Alt, 
  FaJs, 
  FaHtml5, 
  FaCode, 
  FaBook,
  FaLaptopCode 
} from "react-icons/fa";

// Get appropriate icon for lesson type
const getLessonIcon = (topic) => {
  const lowerTopic = topic.toLowerCase();
  if (lowerTopic.includes('css')) return <FaCss3Alt />;
  if (lowerTopic.includes('javascript') || lowerTopic.includes('js')) return <FaJs />;
  if (lowerTopic.includes('html')) return <FaHtml5 />;
  if (lowerTopic.includes('code') || lowerTopic.includes('programming')) return <FaLaptopCode />;
  return <FaBook />;
};

// Get lesson type badge
const getLessonType = (topic) => {
  const lowerTopic = topic.toLowerCase();
  if (lowerTopic.includes('css')) return 'css';
  if (lowerTopic.includes('javascript') || lowerTopic.includes('js')) return 'javascript';
  if (lowerTopic.includes('html')) return 'html';
  return 'general';
};

function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalLessons: 0, totalSections: 0 });

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoading(true);
        const data = await fetchAllLessons();
        setLessons(Array.isArray(data) ? data : []);
        
        // Calculate statistics
        const totalSections = data.reduce((sum, lesson) => 
          sum + (lesson.sections?.length || 0), 0);
        setStats({
          totalLessons: data.length,
          totalSections: totalSections
        });
        
      } catch (err) {
        console.error('Error loading lessons:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, []);

  if (loading) {
    return (
      <>
        <LessonNavigation />
        <div className="lessons-container">
          <h1>Learning Hub</h1>
          <div className="loading">Loading lessons...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <LessonNavigation />
        <div className="lessons-container">
          <h1>Learning Hub</h1>
          <div className="error">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LessonNavigation />
      <div className="lessons-container">
        <h1>Learning Hub</h1>
        
        {/* Statistics */}
        <div className="lessons-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.totalLessons}</div>
            <div className="stat-label">Total Lessons</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalSections}</div>
            <div className="stat-label">Learning Sections</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {lessons.length > 0 ? 
                Math.round(stats.totalSections / stats.totalLessons) : 0
              }
            </div>
            <div className="stat-label">Avg Sections</div>
          </div>
        </div>
        
        {lessons.length === 0 ? (
          <div className="empty">
            <h3>No Lessons Available</h3>
            <p>Check back soon for new learning materials!</p>
          </div>
        ) : (
          <>
            <div className="lessons-intro">
              <p style={{ 
                textAlign: 'center', 
                color: '#666', 
                maxWidth: '800px', 
                margin: '0 auto 2rem',
                fontSize: '1.1rem',
                lineHeight: '1.6'
              }}>
                Explore our curated collection of web development lessons. 
                Each lesson is packed with practical knowledge and real-world examples.
              </p>
            </div>
            
            <div className="lessons-grid">
              {lessons.map((lesson) => {
                const lessonType = getLessonType(lesson.topic);
                const sectionsCount = lesson.sections?.length || 0;
                
                return (
                  <Link 
                    to={`/lessons/${lesson.slug}`} 
                    key={lesson._id || lesson.slug} 
                    className="lesson-card"
                  >
                    <div className={`lesson-type ${lessonType}`}>
                      {lessonType.toUpperCase()}
                    </div>
                    
                    <div className="lesson-icon">
                      {getLessonIcon(lesson.topic)}
                    </div>
                    
                    <h3>{lesson.topic || 'Untitled Lesson'}</h3>
                    
                    <p>
                      Master essential concepts and techniques in {lesson.topic.toLowerCase()}. 
                      Perfect for both beginners and experienced developers.
                    </p>
                    
                    <div className="section-count">
                      {sectionsCount} section{sectionsCount !== 1 ? 's' : ''}
                    </div>
                    
                    <span className="view-lesson">
                      Start Learning
                    </span>
                  </Link>
                );
              })}
            </div>
            
            <div style={{ 
              textAlign: 'center', 
              marginTop: '4rem',
              padding: '2rem',
              color: '#666',
              fontSize: '0.95rem'
            }}>
              <p>More lessons coming soon! Stay tuned for updates.</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Lessons;