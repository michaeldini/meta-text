import './App.css'
import DocumentManagePage from './pages/DocumentManagePage/DocumentManagePage';
import EditPage from './pages/EditPage/EditPage';
import DocumentViewer from './pages/DocumentViewerPage/DocumentViewer';
import DocumentListPage from './pages/DocumentViewerPage/DocumentListPage';
import { Routes, Route } from 'react-router-dom';
import BrowsePage from './pages/BrowsePage/BrowsePage';
import NavBar from './components/NavBar';
import DocumentDetailsPage from './pages/DocumentDetailsPage';
import SourceDocsPage from './pages/SourceDocPage/SourceDocsPage';
import SourceDocDetailPage from './pages/SourceDocPage/SourceDocDetailPage';
import MetaTextPage from './pages/MetaTextPage/MetaTextPage';
import MetaTextDetailPage from './pages/MetaTextPage/MetaTextDetailPage';

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
        <Route path="/documents/:label" element={<DocumentDetailsPage />} />
        <Route path="/sourceDocs" element={<SourceDocsPage />} />
        <Route path="/sourceDocs/:label" element={<SourceDocDetailPage />} />
        <Route path="/metaText" element={<MetaTextPage />} />
        <Route path="/metaText/:label" element={<MetaTextDetailPage />} />
      </Routes>
    </>
  )
}

export default App
