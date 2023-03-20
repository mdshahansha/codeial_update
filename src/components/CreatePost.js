import styles from '../styles/home.module.css';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { addPost } from '../api';
import { usePosts } from '../hooks';

const CreatePost = () => {
  const [post, setPost] = useState('');
  const [addingPost, setAddingPost] = useState(false);
  const posts = usePosts();

  const handleAddPostClick = async () => {
    setAddingPost(true);

    if (post === '') {
      toast.error('Post is empty', {
        position: toast.POSITION.TOP_LEFT,
      });
    } else {
      const response = await addPost(post);
      if (response.success) {
        setPost('');
        posts.addPostToState(response.data.post);

        toast.success('Post created successfully', {
          position: toast.POSITION.TOP_LEFT,
        });
      } else {
        toast.error(response.message, {
          position: toast.POSITION.TOP_LEFT,
        });
      }
    }
    setAddingPost(false);
  };
  return (
    <div className={styles.post}>
      <textarea
        value={post}
        onChange={(e) => setPost(e.target.value)}
      ></textarea>
      <div>
        <button onClick={handleAddPostClick} disabled={addingPost}>
          {addingPost ? 'Adding Post' : 'Add Post'}
        </button>
      </div>
    </div>
  );
};
export default CreatePost;
