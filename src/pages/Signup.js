import styles from '../styles/login.module.css';
import { useState } from 'react';
import { useAuth } from '../hooks';
import { toast } from 'react-toastify';
import { useNavigate, redirect } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signingIn, setSigninIn] = useState();
  const auth = useAuth();
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSigninIn(true);

    let error = false;
    if (!name || !email || !password || !confirmPassword) {
      return toast.error('Please enter inputs!', {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 1000,
      });
      error = true;
    }
    if (password !== confirmPassword) {
      return toast.error('Password and Confirm password dont match', {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 1000,
      });
      error = true;
    }
    if (error) {
      return setSigninIn(false);
    }
    const response = await auth.signup(name, email, password, confirmPassword);

    if (response.success) {
      history('/login');
      setSigninIn(false);
      return toast.success('Sign In successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      console.log('got an error', response);
      return toast.error(response.message, {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 1000,
      });
      setSigninIn(false);
    }
    setSigninIn(false);
  };

  if (auth.user) {
    return redirect('/');
  }
  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <span className={styles.LoginSignupHeader}>Sign Up</span>

      <div className={styles.field}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
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
        <input
          type="password"
          placeholder="Confirm Password"
          autoComplete="on"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        />
      </div>

      <div className={styles.field}>
        <button disabled={signingIn}>
          {signingIn ? 'Signing In..' : 'Sign In'}
        </button>
      </div>
    </form>
  );
};
export default Signup;
