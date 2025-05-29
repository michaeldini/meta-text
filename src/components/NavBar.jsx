import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const navLinks = [
    { to: '/manage', label: 'Manage Docs' },
    { to: '/edit', label: 'Edit' },
    { to: '/viewer', label: 'View Docs' },
    { to: '/browse', label: 'Browse' },
];

export default function NavBar() {
    const location = useLocation();
    return (
        <nav>
            <div className="options-container">
                {navLinks.map(link => (
                    <Link key={link.to} to={link.to}>
                        <button
                            className={
                                location.pathname === link.to || location.pathname.startsWith(link.to)
                                    ? 'option-btn option-btn-active'
                                    : 'option-btn'
                            }
                        >
                            {link.label}
                        </button>
                    </Link>
                ))}
                <span style={{ textTransform: 'uppercase' }}>Meta-Text</span>
            </div>
        </nav>
    );
}
