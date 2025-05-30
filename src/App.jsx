import './App.css'
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
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
        <Route path="/sourceDocs" element={<SourceDocsPage />} />
        <Route path="/sourceDocs/:title" element={<SourceDocDetailPage />} />
        <Route path="/metaText" element={<MetaTextPage />} />
        <Route path="/metaText/:title" element={<MetaTextDetailPage />} />
      </Routes>
    </>
  )
}

export default App
