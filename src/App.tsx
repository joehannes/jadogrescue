import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Box, Spinner, Center } from '@chakra-ui/react';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Donate = lazy(() => import('./pages/Donate').then(module => ({ default: module.Donate })));
const Map = lazy(() => import('./pages/Map').then(module => ({ default: module.Map })));
const Blog = lazy(() => import('./pages/Blog').then(module => ({ default: module.Blog })));
const BlogPost = lazy(() => import('./pages/BlogPost').then(module => ({ default: module.BlogPost })));
const Learn = lazy(() => import('./pages/Learn').then(module => ({ default: module.Learn })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Volunteer = lazy(() => import('./pages/Volunteer').then(module => ({ default: module.Volunteer })));
const Partners = lazy(() => import('./pages/Partners').then(module => ({ default: module.Partners })));

const LoadingSpinner: React.FC = () => (
  <Center h="60vh">
    <Spinner size="xl" color="brand.500" thickness="4px" />
  </Center>
);

const App: React.FC = () => {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/map" element={<Map />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/partners" element={<Partners />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
