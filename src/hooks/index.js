import { useContext, useEffect, useState } from 'react';
import jwt from 'jwt-decode';
import { AuthContext, PostsContext } from '../providers';
import {
  fetchUserFriends,
  getPosts,
  getComments,
  login as userLogin,
} from '../api';
import { register as userSignup } from '../api';
import { update as editProfile } from '../api';
import { createComment, fetchUserProfile as userInfo } from '../api';
import {
  setItemInLocalStorage,
  LOCALSTORAGE_TOKEN_KEY,
  removeItemFromLocalStorage,
  getItemFromLocalStorage,
} from '../utils';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
    const getUser = async () => {
      if (userToken) {
        const user = jwt(userToken);
        const response = await fetchUserFriends();
        let friends = [];
        if (response.success) {
          friends = response.data.friends;
        }
        setUser({
          ...user,
          friends,
        });
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const updateUser = async (userId, name, password, confirmPassword) => {
    const response = await editProfile(userId, name, password, confirmPassword);

    if (response.success) {
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };
  

  
  const login = async (email, password) => {
    const response = await userLogin(email, password);
    if (response.success) {
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };
  const getUserInfo = async (userId) => {
    const response = await userInfo(userId);
    if (response.success) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };
  const signup = async (name, email, password, confirmPassword) => {
    const response = await userSignup(name, email, password, confirmPassword);
    if (response.success) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };
  const logout = () => {
    setUser(null);
    removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
  };
  const updateUserFriends = (addFriend, friend) => {
    if (addFriend) {
      //console.log(friend);
      setUser({
        ...user,
        friends: [...user.friends, friend],
      });
      return;
    } else {
      const newFriends = user.friends.filter(
        (f) => f.to_user._id !== friend.to_user._id
      );
      setUser({
        ...user,
        friends: newFriends,
      });
      return;
    }
  };
  return {
    user,
    login,
    logout,
    loading,
    signup,
    updateUser,
    getUserInfo,
    updateUserFriends,
  };
};
export const usePosts = () => {
  return useContext(PostsContext);
};
export const useProvidePosts = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getPosts();

      console.log('response', response);

      if (response.success) {
        setPosts(response.data.posts);
        setComments(response.data.posts.comments);
      }

      setLoading(false);
    };
    fetchPosts();
  }, []);
  const addPostToState = (post) => {
    const newPosts = [post, ...posts];
    setPosts(newPosts);
  };
  const addComment = (comment, postId) => {
    const newPosts = posts.map((post) => {
      if (post._id === postId) {
        return { ...post, comments: [...post.comments, comment] };
      }

      return post;
    });

    setPosts(newPosts);
  };
  const delComment = (postId, commentId) => {
    const newComments = posts.map((post) => {
      if (post._id === postId) {
        post.comments.filter((comment) => comment._id !== commentId);
      }
    });

    const newPosts = posts.filter((post) => {
      return { ...post, comments: [newComments] };
    });
    setPosts(newPosts);
  };

  return {
    data: posts,
    loading,
    addPostToState,
    addComment,
    delComment,
  };
};
