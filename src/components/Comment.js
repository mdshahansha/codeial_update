import styles from '../styles/home.module.css';
import PropTypes from 'prop-types';
import { deleteComment } from '../api';
import { toast } from 'react-toastify';
import { usePosts, useAuth } from '../hooks';
import { useEffect } from 'react';
import { getComments } from '../api';
import { Navigate, useNavigate } from 'react-router-dom';
const Comment = ({ comment, post }) => {
  const posts = usePosts();
  const auth = useAuth();
  const navigate = useNavigate();
  const handleDeleteComment = async () => {
    const response = await deleteComment(comment._id);
    console.log('response', response);

    if (response.success) {
      //posts.delComment(post._id, comment._id);

      toast.success('Deleted successfully', {
        position: toast.POSITION.TOP_LEFT,
      });
      return navigate('/');
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };
  return (
    <div className={styles.postCommentsItem} key={comment._id}>
      <div className={styles.postCommentHeader}>
        <span className={styles.postCommentAuthor}>{comment.user.name}</span>
        <span className={styles.postCommentTime}>{comment.updatedAt}</span>
        <span className={styles.postCommentLikes}>22</span>
      </div>
      <div className={styles.postComment}>
        <div className={styles.postCommentContent}>{comment.content}</div>

        {auth.user._id === comment.user._id && (
          <div className={styles.deleteComment} onClick={handleDeleteComment}>
            <img src="https://cdn-icons-png.flaticon.com/512/1428/1428314.png" />
          </div>
        )}
      </div>
    </div>
  );
};
Comment.propTypes = {
  comment: PropTypes.object.isRequired,
};
export default Comment;
