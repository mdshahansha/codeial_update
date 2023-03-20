import { Home, Login, Signup, Settings, UserProfile } from '../pages';
import { Loader, Navbar } from './';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useParams,
} from 'react-router-dom';
import { useAuth } from '../hooks';
const PrivateRoute = () => {
  const auth = useAuth();
  return auth.user ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  const auth = useAuth();
  // console.log('auth', auth);
  if (auth.loading) {
    return <Loader />;
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
          </Route>
          <Route path="/user/:user_id" element={<UserProfile />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
