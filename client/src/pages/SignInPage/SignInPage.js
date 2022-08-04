import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignInPage.css";
import AuthService from "../../services/AuthService";
import BaseLayout from "../../layouts/BaseLayout";
import { gapi } from "gapi-script";
import GoogleLoginButton from "../../components/GoogleLogin/GoogleLoginButton";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AuthService.getPlayer();
        if (response.body.username) {
          setLoginStatus(true);
          navigate("/");
        }
      } catch (error) {
        setLoginStatus(false);
      }
    }

    fetchData();
  }, []);

  const onLocalSignIn = async (event) => {
    event.preventDefault();
    const loginPayload = { username, password };

    AuthService.login(loginPayload)
      .then((response) => {
        navigate("/", { state: { username: username } });
      })
      .catch((response) => {
        setUsername("");
        setPassword("");
      });
  };

  return (
    <BaseLayout>
      {/* animations disabled by removing animate__animated from className */}
      <h1 className="animate__rotateIn">Sign in to play the game!</h1>
      <form>
        <input
          className="animate__lightSpeedInRight animate__delay-1s"
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Type your username..."
          value={username}
          required
        />
        <input
          className="animate__lightSpeedInRight animate__delay-1s"
          type="password"
          id="create-roomcode"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Type your password..."
          required
        />
        <div className="auth-buttons">
          <button className="button animate__zoomIn animate__delay-2s" onClick={onLocalSignIn}>
            Sign In with Username
          </button>
          <GoogleLoginButton />
          <button className="button animate__zoomIn animate__delay-2s" id="fb-button">
            Sign In with Facebook
          </button>
        </div>
      </form>
    </BaseLayout>
  );
}
