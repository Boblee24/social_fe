import { useState, useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);
  const onSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: username,
      password: password,
    };
    try {
      const respose = await fetch("http://localhost:3001/auth/login", {
        body: JSON.stringify(data),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await respose.json();
      if (!respose.ok) {
        console.log(result)
      } else {
        localStorage.setItem("accessToken", result.accessToken);
        setAuthState({
          username: result.username,
          id: result.id,
          statue: true,
        });
        console.log(result.success);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit" onClick={onSubmit}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
