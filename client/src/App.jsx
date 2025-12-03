import { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/session`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.user) {
          setSession(data);
        }
      }
    } catch (err) {
      console.error("Session check failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in
        const response = await fetch(`${API_URL}/api/auth/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          await checkSession();
          setEmail("");
          setPassword("");
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Login failed");
        }
      } else {
        // Register
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
            name,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setError("");
          // Auto sign in after registration
          const signInResponse = await fetch(`${API_URL}/api/auth/signin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email,
              password,
            }),
          });
          if (signInResponse.ok) {
            await checkSession();
          }
          setEmail("");
          setPassword("");
          setName("");
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Registration failed");
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch(`${API_URL}/api/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
      setSession(null);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (session?.user) {
    return (
      <div className="app">
        <h1>Hello World</h1>
        <div className="welcome">
          <p>Welcome, {session.user.name || session.user.email}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Hello World</h1>
      <div className="auth-container">
        <div className="auth-tabs">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Loading..." : isLogin ? "Sign In" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
