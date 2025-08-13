import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

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

    const getComments = async () => {
      try {
        const response = await fetch(`http://localhost:3001/comments/${id}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.log("Error fetching comments:", error);
      }
    };
    getPost();
    getComments();
  }, [id]);

 const handleSubmit = async () => {
  if (!commentText.trim()) return;

  setIsSubmitting(true);
  try {
    const response = await fetch(`http://localhost:3001/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accessToken: sessionStorage.getItem("token"),
      },
      body: JSON.stringify({ PostId: id, commentText }),
    });

    if (!response.ok) throw new Error("Failed to submit comment");
    
    const newComment = await response.json(); // ✅ Properly indented inside try block
    setComments(prev => [newComment, ...prev]);
    setCommentText("");
    setShowCommentForm(false);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsSubmitting(false);
  }
};

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Main post card */}
        <article className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden mb-8">
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
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
            <div className="prose prose-gray max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap font-light">
                {post.postText}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-600 transition-all duration-200 shadow-sm hover:shadow-md">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="font-medium">Like</span>
                </button>

                <button
                  onClick={() => setShowCommentForm(!showCommentForm)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="font-medium">
                    Comment ({comments.length})
                  </span>
                </button>

                <button className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-600 transition-all duration-200 shadow-sm hover:shadow-md">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  <span className="font-medium">Share</span>
                </button>
              </div>

              <button className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all duration-200 shadow-sm hover:shadow-md">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </article>

        {/* Comment Form */}
        {showCommentForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8 animate-in slide-in-from-top duration-300">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                Write a comment
              </h3>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  U
                </div>
                <div className="flex-1">
                  <textarea
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 placeholder-gray-400"
                    rows="4"
                    placeholder="Share your thoughts..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">
                      {commentText.length}/500 characters
                    </span>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setShowCommentForm(false);
                          setCommentText("");
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!commentText.trim() || isSubmitting}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Posting...</span>
                          </div>
                        ) : (
                          "Post Comment"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Comments ({comments.length})
            </h2>
          </div>

          {comments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No comments yet
              </h3>
              <p className="text-gray-500 mb-4">
                Be the first to share your thoughts!
              </p>
              <button
                onClick={() => setShowCommentForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Write a comment
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {comments.map((comment, index) => (
                <div
                  key={comment.id || index}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                      {comment.username
                        ? comment.username.charAt(0).toUpperCase()
                        : "B"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-800">
                          {comment.username || "Anonymous"}
                        </h4>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {comment.createdAt
                            ? formatDistanceToNow(new Date(comment.createdAt), {
                                addSuffix: true,
                              })
                            : "just now"}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {comment.commentText}
                      </p>
                      <div className="flex items-center space-x-4 mt-3">
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors duration-200">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span className="text-sm">Like</span>
                        </button>
                        <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
