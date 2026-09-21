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
import Games from './pages/Games';
import QuizGame from './pages/QuizGame';
import NotFound from './pages/NotFound';
import PrivateRoute from './pages/PrivateRoute';

// مكونات الداشبورد
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import VideosAdmin from './pages/VideosAdmin';
import StoriesAdmin from './pages/StoriesAdmin';
import UsersAdmin from './pages/UsersAdmin';

// الداشبورد له تصميمه الخاص، فنخفي النافبار والفوتر هناك فقط
function Layout({ children }) {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
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
          <Route path="/games" element={<Games />} />
          <Route path="/games/quiz" element={<QuizGame />} />
          <Route path="/balloon-game" element={<BalloonGame />} />

          {/* الداشبورد للمدير فقط */}
          <Route path="/dashboard" element={<PrivateRoute role="admin"><DashboardLayout /></PrivateRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="videos" element={<VideosAdmin />} />
            <Route path="stories" element={<StoriesAdmin />} />
            <Route path="users" element={<UsersAdmin />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
