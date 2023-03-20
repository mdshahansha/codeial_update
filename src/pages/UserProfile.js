import styles from '../styles/settings.module.css';
import { useAuth } from '../hooks';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { addFriend, fetchUserProfile, removeFriend } from '../api';
import { toast } from 'react-toastify';
import { Loader } from '../components';

const UserProfile = () => {
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [requestInProgress, setrequestInProgress] = useState(false);
  const id = useParams();
  const userId = id.user_id;
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const getUser = async () => {
      const response = await fetchUserProfile(userId);
      // const response = await auth.getUserInfo(userId);
      console.log('UserProfile', response.data.user);
      if (response.success) {
        setUser(response.data.user);
      } else {
        toast.error(response.message, {
          position: toast.POSITION.TOP_LEFT,
          autoClose: 1000,
        });
        return navigate('/');
      }

      setLoading(false);
    };
    getUser();
  }, [userId, navigate]);
  if (loading) {
    return <Loader />;
  }
  const checkIfUserIsAFriend = () => {
    const friends = auth.user.friends;

    const friendIds = friends.map((friend) => friend.to_user._id);

    const index = friendIds.indexOf(userId);
    if (index !== -1) {
      return true;
    }
    return false;
  };

  const handleRemoveFriendClick = async () => {
    setrequestInProgress(true);
    const response = await removeFriend(userId);
    if (response.success) {
      const friendship = auth.user.friends.filter(
        (friend) => friend.to_user._id === userId
      );

      auth.updateUserFriends(false, friendship[0]);
      toast.success('Friend removed successfully', {
        position: toast.POSITION.TOP_LEFT,
      });
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
    setrequestInProgress(false);
  };
  const handleAddFriendClick = async () => {
    setrequestInProgress(true);
    const response = await addFriend(userId);
    if (response.success) {
      const { friendship } = response.data;

      auth.updateUserFriends(true, friendship);
      toast.success('Friend added successfully', {
        position: toast.POSITION.TOP_LEFT,
      });
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
    setrequestInProgress(false);
  };
  return (
    <div className={styles.settings}>
      <div className={styles.imgContainer}>
        <img src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png" />
      </div>
      <div className={styles.field}>
        <div className={styles.fieldValue}>{user.name}</div>
      </div>
      <div className={styles.field}>
        <div className={styles.fieldValue}>{user.email}</div>
      </div>
      <div className={styles.btnGrp}>
        {checkIfUserIsAFriend() ? (
          <button
            className={`button ${styles.editBtn}`}
            onClick={handleRemoveFriendClick}
          >
            {requestInProgress ? 'Removing Friend' : 'Remove Friend'}
          </button>
        ) : (
          <button
            className={`button ${styles.editBtn}`}
            onClick={handleAddFriendClick}
            disabled={requestInProgress}
          >
            {requestInProgress ? 'Adding Friend' : 'Add Friend'}
          </button>
        )}
      </div>
    </div>
  );
};
export default UserProfile;
