import { useState } from 'react';
import { toast } from 'react-toastify';
import { usePosts } from '../hooks';
import styles from '../styles/home.module.css';

import { Link } from 'react-router-dom';
import { Comment } from '../components';
import { createComment, toggleLike } from '../api';

const Post = ({ post }) => {
  const [comments, setComments] = useState('');
  const [creatingComment, setCreatingComment] = useState(false);
  const posts = usePosts();

  const handleAddComment = async (e) => {
    if (e.key === 'Enter') {
      setComments('');
      setCreatingComment(true);

      const response = await createComment(comments, post._id);
      console.log(response);
      if (response.success) {
        posts.addComment(response.data.comment, post._id);
        toast.success('Commented Successfully', {
          position: toast.POSITION.TOP_LEFT,
        });
      } else {
        toast.error(response.message, {
          position: toast.POSITION.TOP_LEFT,
        });
      }
      setCreatingComment(false);
    }
  };
  const handlePostLikeClick = async () => {
    const response = await toggleLike(post._id, 'Post');
    if (response.success) {
      if (response.data.deleted) {
        toast.success('Like Removed!!', {
          position: toast.POSITION.TOP_LEFT,
        });
      } else {
        toast.success('Like Added!!', {
          position: toast.POSITION.TOP_LEFT,
        });
      }
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };
  return (
    <div className={styles.postWrapper} key={post._id}>
      <div className={styles.postHeader}>
        <div className={styles.postAvatar}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            alt="user-name"
          />
          <div>
            <Link
              to={'/user/' + post.user._id}
              state={{ user: post.user }}
              className={styles.postAuthor}
            >
              {post.user.name}
            </Link>

            <span className={styles.postTime}>a minute ago</span>
          </div>
        </div>
        <div className={styles.postContent}>{post.content}</div>
        <div className={styles.postActions}>
          <div className={styles.postLikes}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png"
              alt="likes-icon"
              onClick={handlePostLikeClick}
            />

            <span>{post.likes.length}</span>
          </div>
          <div className={styles.postCommentsIcon}>
            <img src="https://cdn-icons-png.flaticon.com/512/1380/1380338.png" />
            <span>{posts.comments && post.comments.length}</span>
          </div>
        </div>
        <div className={styles.postCommentBox}>
          <input
            placeholder={
              creatingComment ? 'Commenting...' : 'start typing a comment...'
            }
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            onKeyDown={handleAddComment}
          />
          <div className={styles.postCommentsList}>
            {post.comments?.map((comment) => (
              <Comment
                comment={comment}
                post={post}
                key={`comment-${comment._id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Post;
