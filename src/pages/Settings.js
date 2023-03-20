import styles from '../styles/settings.module.css';
import { useAuth } from '../hooks';
import { useState } from 'react';
import { toast } from 'react-toastify';
const Settings = () => {
  const auth = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(auth.user ? auth.user.name : '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingForm, setSavingForm] = useState(false);

  const clearForm = () => {
    setPassword('');
    setConfirmPassword('');
  };
  const updateProfile = async () => {
    setSavingForm(true);
    let error = false;
    if (!name || !password || !confirmPassword) {
      toast.error('Please enter email and password!', {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 1000,
      });
      error = true;
    }
    if (password != confirmPassword) {
      toast.error('Password and Confirm password dont match', {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 1000,
      });
      error = true;
    }
    if (error) {
      return setSavingForm(false);
    }

    const response = await auth.updateUser(
      auth.user._id,
      name,
      password,
      confirmPassword
    );
    if (response.success) {
      setEditMode(false);
      setSavingForm(false);
      clearForm();
      return toast.success('Updated successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      setSavingForm(false);
      return toast.error(response.message, {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 1000,
      });
    }
  };
  return (
    <div className={styles.settings}>
      <div className={styles.imgContainer}>
        <img src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png" />
      </div>
      <div className={styles.field}>
        <div className={styles.fieldName}>Name</div>
        {editMode ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <div className={styles.fieldValue}>{auth.user?.name}</div>
        )}
      </div>
      <div className={styles.field}>
        <div className={styles.fieldValue}>{auth.user?.email}</div>
      </div>
      {editMode && (
        <>
          <div className={styles.field}>
            <div className={styles.fieldName}>Password</div>
            <input
              autoComplete="on"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <div className={styles.fieldName}>Confirm Password</div>
            <input
              autoComplete="on"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </>
      )}
      <div className={styles.btnGrp}>
        {editMode ? (
          <>
            <button
              className={`button ${styles.saveBtn}`}
              onClick={updateProfile}
              disabled={savingForm}
            >
              {savingForm ? 'Saving Form..' : 'Save'}
            </button>
            <button
              className={`button ${styles.goBackBtn}`}
              onClick={() => setEditMode(false)}
            >
              Back
            </button>
          </>
        ) : (
          <button
            className={`button ${styles.editBtn}`}
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};
export default Settings;
