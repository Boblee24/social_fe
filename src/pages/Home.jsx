import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";

const Home = ( ) => {
  const history = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch posts with likeCount included
  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
    }
  };

  // ✅ Handle toggle like (same as Post.jsx)
  const handleToggleLike = async (postId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/like`, {
        method: "POST", // still POST — backend handles toggle
        headers: {
          "Content-Type": "application/json",
          accessToken: localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({ PostId: postId }), // ✅ no need to send "liked"
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === "Unliked successfully") {
          // ✅ Remove like from local state
          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? { ...p, likeCount: p.likeCount - 1, userHasLiked: false }
                : p
            )
          );
        } else {
          // ✅ Add like to local state
          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? { ...p, likeCount: p.likeCount + 1, userHasLiked: true }
                : p
            )
          );
        }
      }
    } catch (error) {
      console.error("❌ Like error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <div className="grid gap-6 py-6 px-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const userHasLiked = post.userHasLiked || false;

          return (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 p-6"
            >
              {/* Navigate on click */}
              <div onClick={() => history(`/post/${post.id}`)}>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">{post.postText}</p>
                <p className="text-sm text-gray-400 italic">
                  Posted by: {post.username}
                </p>
              </div>

              {/* Like Button - Updated to use handleToggleLike */}
              <button
                className={`flex items-center gap-2 mt-3 ${
                  userHasLiked
                    ? "text-red-500"
                    : "text-gray-600 hover:text-red-500"
                }`}
                disabled={loading}
                onClick={() => handleToggleLike(post.id)}
              >
                <FiHeart />
                Like ({post.likeCount || 0})
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;