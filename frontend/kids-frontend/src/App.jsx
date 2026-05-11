import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Videos from './pages/Videos';
import Stories from './pages/Stories';
import StoryDetail from './pages/StoryDetail';
import BalloonGame from './pages/BalloonGame';

// استدعاء مكونات الداشبورد
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import VideosAdmin from './pages/VideosAdmin';
import StoriesAdmin from './pages/StoriesAdmin';
import UsersAdmin from './pages/UsersAdmin';

// هذا المكون يحدد متى نظهر النافبار والفوتر ومتى نخفيهم
function Layout({ children }) {
  const location = useLocation();
  
  // نحدد الصفحات التي نريد إخفاء النافبار والفوتر فيها
  // ملاحظة: أي رابط يبدأ بـ /dashboard سيتم إخفاء النافبار والفوتر فيه
  const hideElements = 
    ['/videos', '/stories', '/balloon-game'].includes(location.pathname) || 
    location.pathname.startsWith('/story/') ||
    location.pathname.startsWith('/dashboard');

  return (
    <>
      {!hideElements && <Navbar />}
      {children}
      {!hideElements && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/story/:id" element={<StoryDetail />} />
          <Route path="/balloon-game" element={<BalloonGame />} />
          
          {/* مسارات الداشبورد المتداخلة */}
          <Route path="/dashboard" element={<DashboardLayout />}>
             <Route index element={<DashboardHome />} />
             <Route path="videos" element={<VideosAdmin />} />
             <Route path="stories" element={<StoriesAdmin />} />
             <Route path="users" element={<UsersAdmin />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;