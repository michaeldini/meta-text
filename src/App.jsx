import './App.css'
import DocumentManagePage from './DocumentManagePage';
import EditPage from './EditPage'
import DocumentViewer from './DocumentViewer';
import DocumentListPage from './DocumentListPage';
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <>
      <nav>
        <div className="options-container" >
          <Link to="/manage"><button>Manage Docs</button></Link>
          <Link to="/edit"><button>Edit</button></Link>
          <Link to="/viewer"><button>View Docs</button></Link>
        </div>
        <span style={{ textTransform: 'uppercase' }}>Meta-Text</span>
      </nav>
      <Routes>
        <Route path="/" element={<div>Welcome to Meta-Text</div>} />
        <Route path="/manage" element={<DocumentManagePage />} />
        <Route path="/edit" element={<EditPage />} />
        <Route path="/viewer" element={<DocumentListPage />} />
        <Route path="/viewer/:name" element={<DocumentViewer />} />
      </Routes>
    </>
  )
}

export default App
