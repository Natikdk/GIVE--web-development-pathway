// component/LessonNavigation.jsx
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAllLessons } from "../api/lessons";
import bookIcon from "../assets/lucide-BookText-Outlined.svg";
import "../styles/component/LessonNavigation.css";
const LessonNavigation = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoading(true);
        const data = await fetchAllLessons();
        console.log('Navigation lessons:', data); // Debug log
        setLessons(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading lessons for navigation:', err);
        setError(err.message);
        setLessons([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, []);

  // Don't show loading state in navigation - just show empty if loading/error
  if (loading || error) {
    return (
      <nav className="lesson-navbar">
        <div className="logo">
         
          GIVE
        </div>
        <ul className="topics">
          <li><span className="loading-text">Loading...</span></li>
        </ul>
        <ul className="nav-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/lessons">Lessons</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
        </ul>
      </nav>
    );
  }
  

  return (
    <nav className="lesson-navbar">
      <div className="logo">
       
        GIVE
      </div>

      <ul className="topics">
        {lessons.map((lesson) => (
          <li key={lesson._id || lesson.slug}>
            <NavLink
              to={`/lessons/${lesson.slug}`}
              className={({ isActive }) =>
                isActive ? "active-topic" : ""
              }
            >
              {lesson.topic || 'Untitled'}
            </NavLink>
          </li>
        ))}
      </ul>

      <ul className="nav-links">
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/lessons">Lessons</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
      </ul>
    </nav>
  );
};

export default LessonNavigation;