import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { AuthContext } from "../helpers/AuthContext"; // 👈 import context

const Home = () => {
  const history = useNavigate();
  const { authState } = useContext(AuthContext); // 👈 get logged-in user
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch posts (now includes PostLikes array)
  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/posts", {
        headers: {
          accessToken: localStorage.getItem("accessToken"), // required since route is protected
        },
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
    }
  };

  // ✅ Toggle Like / Unlike
  const handleToggleLike = async (postId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/like`, {
        method: "POST", // backend handles toggle
        headers: {
          "Content-Type": "application/json",
          accessToken: localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({ PostId: postId }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === "Unliked successfully") {
          // remove current user from PostLikes
          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    PostLikes: p.PostLikes.filter(
                      (like) => like.username !== authState.username
                    ),
                  }
                : p
            )
          );
        } else {
          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    PostLikes: [...p.PostLikes, { username: authState.username }],
                  }
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
  console.log(posts)

  return (
    <div>
      <div className="grid gap-6 py-6 px-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const likeCount = post.PostLikes?.length || 0;
          const userHasLiked = post.PostLikes?.some(
            (like) => like.username === authState.username
          );

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

              {/* Like Button */}
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
                {userHasLiked ? "Unlike" : "Like"} ({likeCount})
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
