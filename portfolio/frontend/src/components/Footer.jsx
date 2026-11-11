import { Link } from 'react-router-dom';
import { navLinks } from './Navbar';
import SocialLinks from './SocialLinks';
import useApi from '../hooks/useApi';
import { defaultProfile } from '../data/defaults';

export default function Footer() {
  const { data } = useApi('/profile', defaultProfile);
  const profile = data || defaultProfile;
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <p className="brand">SM<span>.</span></p>
          <p className="muted">Building reliable backends with Node.js.</p>
        </div>
        <ul className="footer-links">
          {navLinks.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}
        </ul>
        <SocialLinks profile={profile} />
      </div>
      <p className="container muted copyright">© {new Date().getFullYear()} Santanu Manna. All rights reserved.</p>
    </footer>
  );
}
