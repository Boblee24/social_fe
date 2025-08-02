import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/posts/byId/${id}`);
        if (!response.ok) throw new Error("Post not found");
        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError(error.message);
      }
    };
    getPost();
  }, [id]);
  let timeAgo = "";
  if (post && post.createdAt) {
    timeAgo = formatDistanceToNow(new Date(post.createdAt), {
      addSuffix: true,
    });
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-red-600 text-lg">
        {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-500 text-lg">
        Loading post...
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-3xl mx-auto my-8">
      {/* Main post card */}
      <article className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
        {/* Header with gradient accent */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="p-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight hover:text-blue-600 transition-colors duration-200">
            {post.title}
          </h1>
          
          {/* Author and time info */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {/* Avatar placeholder */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {post.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
                  {post.username}
                </p>
                <p className="text-xs text-gray-500">Author</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 font-medium">{timeAgo}</p>
              <p className="text-xs text-gray-400">Published</p>
            </div>
          </div>
          
          {/* Post content */}
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap font-light">
              {post.postText}
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-medium">Like</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-medium">Comment</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="font-medium">Share</span>
              </button>
            </div>
            
            <button className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
      </article>
    </div>
    </div>
  );
}

export default Post;
