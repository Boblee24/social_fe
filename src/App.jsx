import "./App.css";
import { useState, useEffect } from "react";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Post from "./pages/Post";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { AuthContext } from "./helpers/AuthContext";
import User from "./pages/User";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  const Logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      status: false,
    });
  };
  const navigate = useNavigate();

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
        const data = await response.json();
        if (!response.ok) {
          setAuthState({
            ...authState,
            status: false,
          });
        } else {
          setAuthState({
            username: data.username,
            id: data.id,
            status: true,
          });
        }
      } catch (error) {
        console.error("Error verifying authentication:", error);
      }
    };
    checkAuth();
  }, []);

  console.log(authState);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo/Brand */}
              <Link
                to="/"
                className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                MyApp
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center space-x-6">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/createpost"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Create Post
                </Link>

                {/* Authentication Section */}
                {!authState.status ? (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div
                      onClick={() => navigate(`/user/${authState.id}`)}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center ">
                        <span className="text-white text-sm font-medium">
                          {authState.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-700 font-medium">
                        {authState.username}
                      </span>
                    </div>
                    <button
                      onClick={Logout}
                      className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/user/:id" element={<User />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-gray-500 text-sm">
              © 2025 MyApp. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
