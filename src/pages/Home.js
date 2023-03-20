import styles from '../styles/home.module.css';
import { FriendsList, CreatePost, Post } from '../components';
import { useEffect, useState } from 'react';

import { Loader } from '../components';

import React from 'react';
import { usePosts, useAuth } from '../hooks';
const Home = () => {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState('');
  const auth = useAuth();
  const posts = usePosts();
  // const theme = React.createContext();

  // const { primary } = React.useContext(theme);
  // console.log(theme);

  if (posts.loading) {
    return <Loader />;
  }
  return (
    <div className={styles.home}>
      <div className={styles.postsList}>
        <CreatePost />
        {posts.data.map((post) => (
          <Post post={post} key={`post-${post._id}`} />
        ))}
      </div>
      {auth.user && <FriendsList key={auth.user._id} />}
    </div>
  );
};

export default Home;
