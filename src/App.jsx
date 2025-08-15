import "./App.css";
import { useState, useEffect } from "react";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Post from "./pages/Post";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { AuthContext } from "./helpers/AuthContext";
function App() {
  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/auth", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        if (response.ok) {
          setAuthState(true);
        } else {
          setAuthState(false);
        }
      } catch (error) {
        console.error("Error verifying authentication:", error);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
    <div className="p-4">
      <Router>
        <Link to="/createpost">Create Post</Link>
        {!authState && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/post/:id" element={<Post />} />
        </Routes>
      </Router>
    </div>
    </AuthContext.Provider>
  );
}

export default App;
