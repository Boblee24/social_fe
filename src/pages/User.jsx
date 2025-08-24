import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const User = () => {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [userPost, setUserPost] = useState([])
  const [user, setUser] = useState({});
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/user/${id}`);
        if (!response.ok) throw new Error("User not found");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      }
    };
    
    const getUserPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/${id}/posts`);
        if (!response.ok) throw new Error("Posts not found");
        const data = await response.json();
        setUserPost(data);
      } catch (error) {
        setError(error.message);
      }
    };

    getUser()
    getUserPost()
  }, [id]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* User Profile Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">User Profile</h1>
        
        {user.username ? (
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-semibold text-gray-600 w-24">Username:</span>
              <span className="text-gray-800">{user.username}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-600 w-24">User ID:</span>
              <span className="text-gray-800">{user.id}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-600 w-24">Joined:</span>
              <span className="text-gray-800">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        ) : (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        )}
      </div>

      {/* User Posts Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Posts by {user.username || 'User'}
          </h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
            {userPost.length} {userPost.length === 1 ? 'Post' : 'Posts'}
          </span>
        </div>

        {userPost.length > 0 ? (
          <div className="space-y-4">
            {userPost.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3 leading-relaxed">{post.postText}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>By: {post.username}</span>
                  <span>Post ID: {post.id}</span>
                </div>
                
                {post.createdAt !== post.updatedAt && (
                  <div className="text-xs text-gray-400 mt-2">
                    Last updated: {new Date(post.updatedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">No posts found</p>
            <p className="text-gray-400 text-sm">This user hasn't created any posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;