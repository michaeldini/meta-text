import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import SourceDocsPage from './pages/SourceDocPage/SourceDocsPage';
import SourceDocDetailPage from './pages/SourceDocPage/SourceDocDetailPage';
import MetaTextPage from './pages/MetaTextPage/MetaTextPage';
import MetaTextDetailPage from './pages/MetaTextPage/MetaTextDetailPage';
import { Fade } from '@mui/material';
import { useMemo } from 'react';

function App() {
  const location = useLocation();
  // Use location.key as a unique key for transitions
  const routeElement = useMemo(() => (
    <Routes location={location} key={location.key}>
      <Route path="/" element={<h1>Welcome to Meta-Text</h1>} />
      <Route path="/sourceDocs" element={<SourceDocsPage />} />
      <Route path="/sourceDocs/:title" element={<SourceDocDetailPage />} />
      <Route path="/metaText" element={<MetaTextPage />} />
      <Route path="/metaText/:id" element={<MetaTextDetailPage />} />
    </Routes>
  ), [location]);

  return (
    <>
      <NavBar />
      <Fade in={true} key={location.pathname} timeout={750}>
        <div>{routeElement}</div>
      </Fade>
    </>
  )
}

export default App
