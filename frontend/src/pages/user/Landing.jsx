import {Link} from 'react-router-dom';
import '../../styles/user/Landing.css';
import Hero from'../../assets/hero.png';
import Book from '../../assets/icons/lucide-BookText-Outlined (1).svg';
import Pallete from '../../assets/icons/lucide-Palette-Outlined.svg';
import Code from '../../assets/icons/lucide-Code-Outlined.svg';
import Responsive from '../../assets/icons/lucide-TabletSmartphone-Outlined.svg';
import GitFork from '../../assets/icons/lucide-GitFork-Outlined.svg';
import Server from '../../assets/icons/lucide-Server-Outlined.svg';    
import Navigation from '../../component/Navigation.jsx';
import Footer from '../../component/Footer.jsx';

function Landing(){
    return(

        <>
    <Navigation/>
    <div className="landing">

    <section className="hero">
        <div className="hero-text">
            <h1>Start Your Web Development Journey Today.</h1>
            <p>Unlock the world of web development with easy-to-follow lessons. From HTML basics to advanced JavaScript,
                we've got you covered.</p>
            <Link className="btn" to="/lessons">Start Learning</Link>
        </div>
        <img src={Hero} className="hero-img" alt="hero" />
    </section>

    {/* COURSES SECTION */}
    <section id="courses" className="section">
        <h2 className="section-title">Explore Core Web Technologies</h2>

        <div className="course-cards">
            <Link to="/lessons/HTML" className="card-link">
                <div className="card">
                    <img src={Book} alt="bookText" />
                    <h3>HTML Fundamentals</h3>
                    <p>Master the building blocks of the web and structure your content.</p>
                </div>
            </Link>

            <Link to="/lessons/css" className="card-link">
                <div className="card">
                    <img src={Pallete} alt="palette" />
                    <h3>Styling with CSS</h3>
                    <p>Learn to design beautiful and responsive web interfaces..</p>
                </div>
            </Link>

            <Link to="/lessons/javaScript" className="card-link">
                <div className="card">
                    <img src={Code} alt="code" />
                    <h3>Interactive JavaScript</h3>
                    <p>Add dynamic behavior and interactivity to your web applications.</p>
                </div>
            </Link>

            <Link to="/lessons/css#responsive" className="card-link">
                <div className="card">
                    <img src={Responsive} alt="book" />
                    <h3>Responsive Web Design </h3>
                    <p>Make your websites look great on any device size.</p>
                </div>
            </Link>

            <Link to="/lessons/git" className="card-link">
                <div className="card">
                    <img src={GitFork} alt="GitFork" />

                    <h3>Version Control with Git</h3>
                    <p>Collaborate effectively and track changes in your projects.</p>
                </div>
            </Link>

            <Link to="/lessons/nodejs" className="card-link">
                <div className="card">
                    <img src={Server} alt="server" />
                    <h3>Backend Web Development</h3>
                    <p>Understand server-side logic and database interactions.</p>
                </div>
            </Link>

        </div>
    </section>
    </div>
    <Footer/>
        </>
    )
}
export default Landing;

