import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignInPage.css";
import AuthService from "../../services/AuthService";
import BaseLayout from "../../layouts/BaseLayout";
import GoogleLogin from "../../components/googleLogin";
import GoogleLogout from "../../components/googleLogout";
import { gapi } from "gapi-script";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const navigate = useNavigate();
  const CLIENT_ID = "219662561135-pm8u2seq0jn6h9bebu6j86jlrjv8pmsi.apps.googleusercontent.com";

  useEffect(() => {
    AuthService.getPlayer().then((response) => {
      if (response.body.username) {
        setLoginStatus(true);
        console.log(response.body.username);
        navigate("/");
      } else {
        setLoginStatus(false);
      }
    });
    function start() {      
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: "profile email",
      });
    }
    gapi.load("client:auth2", start);
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
          <GoogleLogin />
          {/* <button className="button animate__zoomIn animate__delay-2s" onClick={onGoogleSignIn} id="google-button">Sign In with Google</button> */}
          <button className="button animate__zoomIn animate__delay-2s" id="fb-button">
            Sign In with Facebook
          </button>
        </div>
      </form>
    </BaseLayout>
  );
}
