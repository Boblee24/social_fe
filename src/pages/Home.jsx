import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const history = useNavigate();
  const [posts, setPosts] = useState([]);

  const getposts = async () => {
    const response = await fetch("http://localhost:3001/posts");
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    getposts();
  }, []);
  return (
    <div>
      <div className="grid gap-6 py-6 px-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 p-6"
            onClick={() => {
              history(`/post/${post.id}`);
            }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {post.title}
            </h2>
            <p className="text-gray-600 mb-4">{post.postText}</p>
            <p className="text-sm text-gray-400 italic">
              Posted by: {post.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
