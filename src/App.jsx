import './App.css'
import DocumentManagePage from './pages/DocumentManagePage/DocumentManagePage';
import EditPage from './EditPage'
import DocumentViewer from './DocumentViewer';
import DocumentListPage from './DocumentListPage';
import { Routes, Route } from 'react-router-dom';
import BrowsePage from './BrowsePage';
import NavBar from './components/NavBar';

function App() {
  return (
    <>
      <NavBar />
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
