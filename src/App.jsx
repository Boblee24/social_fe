import "./App.css";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";

function App() {

  

  return (
    <div className="p-4">
      <Router>
        <Link to="/createpost">Create Post</Link> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createpost" element={<CreatePost />} />
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
