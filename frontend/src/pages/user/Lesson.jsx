// pages/Lesson.jsx
import { fetchLessonBySlug } from "../../api/lessons";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/user/Lesson.css";
import SideBar from "../../component/SideBar";
import LessonNavigation from "../../component/LessonNavigation";

function Lesson() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true);
        const data = await fetchLessonBySlug(slug);
        setLesson(data);
      } catch (err) {
        console.error(`Error loading lesson ${slug}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [slug, navigate]);

  if (loading) {
    return (
      <>
        <LessonNavigation />
        <div className="lesson-container">
          <div className="loading">Loading lesson...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <LessonNavigation />
        <div className="lesson-container">
          <div className="error">
            <h2>Lesson not found</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/lessons')}>
              Back to Lessons
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!lesson) {
    return (
      <>
        <LessonNavigation />
        <div className="lesson-container">
          <div className="error">
            <h2>Lesson not found</h2>
            <button onClick={() => navigate('/lessons')}>
              Back to Lessons
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LessonNavigation />
      <div className="lesson-container">
        <SideBar sections={lesson.sections} />
        <main className="main">
          <h1>{lesson.topic}</h1>
          {lesson.sections.map((section) => (
            <section key={section.anchor} id={section.anchor}>
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </section>
          ))}
        </main>
      </div>
    </>
  );
}

export default Lesson;