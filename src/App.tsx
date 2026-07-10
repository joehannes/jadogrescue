import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Box, Spinner, Center } from '@chakra-ui/react';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Donate = lazy(() => import('./pages/Donate').then(module => ({ default: module.Donate })));
const Map = lazy(() => import('./pages/Map').then(module => ({ default: module.Map })));
const Blog = lazy(() => import('./pages/Blog').then(module => ({ default: module.Blog })));
const BlogPost = lazy(() => import('./pages/BlogPost').then(module => ({ default: module.BlogPost })));
const Learn = lazy(() => import('./pages/Learn').then(module => ({ default: module.Learn })));
const VisionMission = lazy(() => import('./pages/VisionMission').then(module => ({ default: module.VisionMission })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Volunteer = lazy(() => import('./pages/Volunteer').then(module => ({ default: module.Volunteer })));
const Partners = lazy(() => import('./pages/Partners').then(module => ({ default: module.Partners })));
const Admin = lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));
const Legal = lazy(() => import('./pages/Legal').then(module => ({ default: module.Legal })));

const LoadingSpinner: React.FC = () => (
  <Center h="60vh">
    <Spinner size="xl" color="brand.500" thickness="4px" />
  </Center>
);

const App: React.FC = () => {
  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/map" element={<Map />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/vision-mission" element={<VisionMission />} />
          <Route path="/about" element={<Navigate to="/vision-mission" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy" element={<Legal slug="privacy" />} />
          <Route path="/terms" element={<Legal slug="terms" />} />
          <Route path="/transparency" element={<Legal slug="transparency" />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
