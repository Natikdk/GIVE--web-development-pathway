import {Link} from 'react-router-dom';
import Aron from '../../assets/aron.jpg';
import Nati from '../../assets/natanim.jpg';
import Dagim from '../../assets/dagi.jpg';
import Navigation from '../../component/Navigation';
import Footer from '../../component/Footer';
import '../../styles/user/About.css';


function About(){
    return(

        <>
    <Navigation/>
    <div className="about">
    <section className="section about-header">
    <h1 className="section-title ">About Us</h1>
    <p className="center-text">
        GIVE is committed to making web development accessible and enjoyable for everyone. Our platform offers a clear, step-by-step learning journey through fundamental technologies like HTML, CSS, and JavaScript. We believe that a strong foundation and a supportive community are key to empowering aspiring developers to build their dreams.
    </p>
</section>

{/* TEAM SECTION */}
<section className="section team-section ">
    <h2 className="section-title ">Meet the Team</h2>

    <div className="team">
        <div className="team-card">
            <img src={Dagim} alt="dagi" />
            <h3>Dagmawi</h3>
            <p>Frontend Designer</p>
        </div>

        <div className="team-card">
            <img src={Nati} alt="nati" />
            <h3>Natanim</h3>
            <p>Content Specialist</p>
        </div>

        <div className="team-card">
            <img src={Aron} alt="aron" />
            <h3>Aron</h3>
            <p>Project Lead</p>
        </div>
    </div>
</section>
</div>
<Footer/>
</>
    )
};
export default About;