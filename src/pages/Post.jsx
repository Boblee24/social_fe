import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "../helpers/AuthContext";
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiBookmark,
  FiX,
} from "react-icons/fi";

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  // const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);

  const { authState } = useContext(AuthContext);

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
    const getLikes = async () => {
      try {
        const response = await fetch(`http://localhost:3001/like/${id}`);

        if (response.ok) {
          const data = await response.json();
          setLikes(data);
          return;
        }
      } catch (error) {
        console.log("Error fetching likes", error);
      }
    };
    getPost();
    getComments();
    getLikes();
  }, [id]);

  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );
      if (!response.ok) {
        console.error("Failed to delete comment");
        return;
      }
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleSubmit = async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:3001/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accessToken: localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({ PostId: id, commentText }),
      });

      if (!response.ok) {
        console.log("Error creating comment:", response.statusText);
        return;
      }

      const newComment = await response.json();
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      setShowCommentForm(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = async () => {
    try {
      const response = await fetch(`http://localhost:3001/like`, {
        method: "POST", // still POST — backend handles toggle
        headers: {
          "Content-Type": "application/json",
          accessToken: localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({ PostId: id }), // ✅ no need to send "liked"
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === "Unliked successfully") {
          // ✅ Remove like from local state
          setLikes((prev) =>
            prev.filter((like) => like.username !== authState.username)
          );
        } else {
          // ✅ Add like to local state
          setLikes((prev) => [...prev, data]);
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const userHasLiked = likes.some(
    (like) => like.username === authState.username
  );
  let timeAgo = "";
  if (post && post.createdAt) {
    timeAgo = formatDistanceToNow(new Date(post.createdAt), {
      addSuffix: true,
    });
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!post) {
    return <div className="p-4 text-gray-500">Loading post...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Post */}
      <div className="bg-white border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-3">{post.title}</h1>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <span>By {post.username}</span>
          <span>{timeAgo}</span>
        </div>

        <p className="text-gray-700 mb-4">{post.postText}</p>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            className={`flex items-center gap-2 ${
              userHasLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
            onClick={() => {
              handleToggleLike(!userHasLiked); // toggle like/unlike in one function
            }}
          >
            <FiHeart /> Like ({likes.length})
          </button>

          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
          >
            <FiMessageCircle /> Comment ({comments.length})
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-green-500">
            <FiShare2 /> Share
          </button>
          <button className="ml-auto text-gray-600 hover:text-blue-500">
            <FiBookmark />
          </button>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit explicabo ullam eaque recusandae quos autem debitis maiores perferendis animi, porro assumenda suscipit! Eligendi quibusdam modi ab quae quia ipsum quod?</p>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <div className="bg-white border rounded-lg p-4">
          <textarea
            className="w-full p-3 border rounded resize-none"
            rows="3"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => {
                setShowCommentForm(false);
                setCommentText("");
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!commentText.trim() || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Comments ({comments.length})</h2>
        </div>

        {comments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No comments yet</p>
            <button
              onClick={() => setShowCommentForm(true)}
              className="mt-2 text-blue-600 hover:text-blue-700"
            >
              Be the first to comment
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium">
                      {comment.username || "Anonymous"}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {comment.createdAt
                        ? formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })
                        : "just now"}
                    </span>
                  </div>
                  {authState.username === comment.username && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
                <p className="text-gray-700 mb-3">{comment.commentText}</p>
                <div className="flex gap-4">
                  <button className="text-sm text-gray-500 hover:text-blue-600">
                    Like
                  </button>
                  <button className="text-sm text-gray-500 hover:text-blue-600">
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
