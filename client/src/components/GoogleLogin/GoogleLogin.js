import { gapi } from "gapi-script";
import { useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

const CLIENT_ID = "219662561135-pm8u2seq0jn6h9bebu6j86jlrjv8pmsi.apps.googleusercontent.com";

export default function GoogleLoginButton() {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize gapi object to enable Google OAuth login
    // the codes below run only once
    function start() {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: "profile email",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const onSuccess = async (res) => {
    console.log("LOGIN SUCCESS! Current user: ", res.profileObj);
    const loginPayload = { username: res.profileObj.name, googleId: res.profileObj.googleId };
    AuthService.login(loginPayload).then((response) => {
      navigate("/", { state: { username: res.profileObj.name } });
    });
  };
  const onFailure = (res) => {
    // console.log("LOGIN Failed! res: ", res);
  };
  return (
    <div id="googleSignInButton">
      <GoogleLogin
        clientId={process.env.GOOGLE_CLIENT_ID}
        buttonText="Login"
        render={(renderProps) => (
          <button onClick={renderProps.onClick} id="google-button">
            Sign in with Google
          </button>
        )}
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={false}
      />
    </div>
  );
}