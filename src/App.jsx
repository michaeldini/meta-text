import './App.css'
import DocumentManagePage from './DocumentManagePage';
import EditPage from './EditPage'
import DocumentViewer from './DocumentViewer';
import DocumentListPage from './DocumentListPage';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import BrowsePage from './BrowsePage';

function App() {
  const location = useLocation();
  const navLinks = [
    { to: '/manage', label: 'Manage Docs' },
    { to: '/edit', label: 'Edit' },
    { to: '/viewer', label: 'View Docs' },
    { to: '/browse', label: 'Browse' },
  ];
  return (
    <>
      <nav>
        <div className="options-container" >
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}>
              <button
                className={
                  location.pathname === link.to || (link.to === '/viewer' && location.pathname.startsWith('/viewer'))
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
      <Routes>
        <Route path="/" element={<div>Welcome to Meta-Text</div>} />
        <Route path="/manage" element={<DocumentManagePage />} />
        <Route path="/edit" element={<EditPage />} />
        <Route path="/viewer" element={<DocumentListPage />} />
        <Route path="/viewer/:name" element={<DocumentViewer />} />
        <Route path="/browse" element={<BrowsePage />} />
      </Routes>
    </>
  )
}

export default App
