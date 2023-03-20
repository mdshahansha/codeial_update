import styles from '../styles/login.module.css';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../hooks';
import { Navigate } from 'react-router-dom';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    if (!email || !password) {
      setLoggingIn(false);
      return toast.error('Please enter email and password!', {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 1000,
      });
    }
    const response = await auth.login(email, password);

    if (response.success) {
      console.log(auth.user);
      toast.success('Logged in successfully', {
        position: toast.POSITION.TOP_LEFT,
      });
    } else {
      setLoggingIn(false);
      toast.error(response.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };

  if (auth.user) {
    return <Navigate to="/"></Navigate>;
  }
  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <span className={styles.LoginSignupHeader}>Log In</span>

      <div className={styles.field}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>

      <div className={styles.field}>
        <input
          type="password"
          placeholder="Password"
          autoComplete="on"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>

      <div className={styles.field}>
        <button disabled={loggingIn}>
          {loggingIn ? 'Logging In..' : 'Log In'}
        </button>
      </div>
    </form>
  );
};
export default Login;
