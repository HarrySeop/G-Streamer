import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <Layout>
            <ProtectedRoute />
          </Layout>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/video/:fileId" element={<VideoPlayerPage />} />
      </Route>
    </Routes>
  );
}

export default App;
