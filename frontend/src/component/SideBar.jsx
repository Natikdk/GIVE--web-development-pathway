import { useState, useEffect } from "react";
import '../styles/component/SideBar.css';
import ChevronRight from "../assets/lucide-ChevronRight-Outlined.svg";

function SideBar({ sections }) {
  const [isActive, setIsActive] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsActive(false);
      }
    };
    
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px', // Adjust these values as needed
        threshold: 0.1
      }
    );
    
    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.anchor);
      if (element) {
        observer.observe(element);
      }
    });
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [sections]);

  const handleMenuClick = () => {
    setIsActive(true);
  };

  const handleOverlayClick = () => {
    setIsActive(false);
  };

  const handleLinkClick = (e, anchor) => {
    e.preventDefault();
    setIsActive(false);
    setActiveSection(anchor);
    
    // Smooth scroll to section
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      {/* Menu button - only visible on mobile via CSS */}
      <button 
        id="menubtn" 
        className="menubtn" 
        onClick={handleMenuClick}
      >
        TOPICS <img src={ChevronRight} alt="Chevron" />
      </button>
      
      {/* Overlay - only functional on mobile via CSS */}
      <div 
        id="overlay" 
        className={isActive ? "active" : ""}
        onClick={handleOverlayClick}
      ></div>
      
      {/* Sidebar */}
      <aside 
        id="sidebar"
        className={`sidebar ${isActive ? "active" : ""}`}
      >
        <h3 className="title">Lesson Topics</h3>
        <ul className="lesson-list">
          {sections.map((section) => (
            <li 
              key={section.anchor}
              className={activeSection === section.anchor ? "active" : ""}
            >
              <a 
                href={`#${section.anchor}`} 
                onClick={(e) => handleLinkClick(e, section.anchor)}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

export default SideBar;