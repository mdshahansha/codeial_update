import styles from '../styles/home.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
const FriendList = () => {
  const auth = useAuth();
  const { friends = [] } = auth.user;

  return (
    <div className={styles.friendsList}>
      <div className={styles.header}>Friends</div>
      {friends && friends.length === 0 && (
        <div className={styles.noFriends}>No Friends Found</div>
      )}
      {friends &&
        friends.map((friend) => (
          <div key={`friend-${friend._id}`}>
            <Link
              className={styles.friendsItem}
              to={`/user/${friend.to_user._id}`}
              state={{ user: friend.to_user.name }}
            >
              <div className={styles.friendsImg}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/9308/9308285.png"
                  alt="friends img"
                ></img>
              </div>

              <div className={styles.friendsName}>{friend.to_user.name}</div>
            </Link>
          </div>
        ))}
    </div>
  );
};
export default FriendList;
