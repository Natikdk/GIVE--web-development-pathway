import { Link } from "react-router-dom";
import '../styles/component/Footer.css';
import Book from '../assets/icons/lucide-BookText-Outlined (1).svg';
import GitHub from '../assets/icons/lucide-Github-Outlined.svg';
import LinkedIn from '../assets/icons/lucide-Linkedin-Outlined.svg';
import Twitter from '../assets/icons/lucide-Twitter-Outlined.svg';
function Footer(){
    return(
    <footer className='footer'>
        <div className="footer-container">
            <div className="foot">
                <span className="logo"><img src={Book} alt="logo" />GIVE</span>

            </div>



            <div className="foot company">
                <h4>Company</h4>
                <span>About Us</span>
                <span>Contact</span>
                <span>Careers</span>

            </div>

            <div className="foot">
                <h4>Legal</h4>
                <span>Privacy Policy</span>
            </div>

            <div className="foot">
                <h4>Contact Us</h4>
                <div className="icon-links">
                    <Link to=""><img src={GitHub} alt="Github" /></Link>
                    <Link to=""><img src={LinkedIn} alt="LinkedIn" /></Link>
                    <Link to=""><img src={Twitter} alt="twitter" /></Link>
                </div>
            </div>
        </div>

        <hr />
        <p className="copyright">© 2025 Learning Center. All rights reserved.</p>
    </footer>
)
}

export default Footer;