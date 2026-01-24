import { NavLink } from "react-router-dom";
import '../styles/component/Navigation.css';

function Navigation(){
   return(<>
      <nav className="navbar">
            <div className="logo">GIVE</div>
            <ul className="nav-links">
                <li><NavLink to="/" >Home</NavLink></li>
                <li><NavLink to="/lessons">Lessons</NavLink></li>
                <li><NavLink to="/contact">Contact</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
            </ul>
        </nav>
   </>)
}

export default Navigation;