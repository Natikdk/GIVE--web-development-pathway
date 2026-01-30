// pages/Lesson.jsx
import { fetchLessonBySlug } from "../../api/lessons";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/user/Lesson.css";
import SideBar from "../../component/SideBar";
import LessonNavigation from "../../component/LessonNavigation";
import SimplePlayground from "../../component/SimplePlayGround";
import Quiz from "../../component/Quiz";
import YouTubeEmbed from "../../component/YoutubeEmbed";

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

              {section.hasPlayground && (
         <SimplePlayground
          initialHTML={section.playground?.html || ''}
          initialCSS={section.playground?.css || ''}
          initialJS={section.playground?.js || ''}
          instructions={section.playground?.instructions || ''}
        />
              )};

        {section.quiz?.enabled && section.quiz.questions?.length > 0 && (
          <div className="section-quiz">
            <h3>📝 Test Your Understanding</h3>
            <Quiz 
              questions={section.quiz.questions}
              onComplete={(score) => {
                // Save score to localStorage
                localStorage.setItem(`quiz_${lesson.slug}_${section.anchor}`, score);
              }}
            />
          </div>
        )}

           {/* Video Embed */}
          {section.hasVideo && section.video?.youtubeId && (
            <YouTubeEmbed
              youtubeId={section.video.youtubeId}
              title={section.video.title}
              description={section.video.description}
              startTime={section.video.startTime}
              endTime={section.video.endTime}
            />
          )}
                      

            </section>
          ))}
        </main>
      </div>
    </>
  );
}

export default Lesson;