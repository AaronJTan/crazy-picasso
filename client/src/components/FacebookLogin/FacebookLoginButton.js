import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

const FacebookLoginButton = () => {
  const navigate = useNavigate();
  const responseFacebook = (response) => {
    console.log(response);
    const loginPayload = { username: response.name, email: response.email, facebookLogin: true };
    AuthService.login(loginPayload).then((response) => {
      navigate("/", { state: { username: response.name } });
    });
  };

  const componentClicked = (data) => {
    console.log(data);
  };

  return (
    <FacebookLogin
      appId="999375250754939"
      autoLoad={false}
      fields="name,email,picture"
      onClick={componentClicked}
      callback={responseFacebook}
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          className="button animate__zoomIn animate__delay-2s"
          id="fb-button"
        >
          Sign In with Facebook
        </button>
      )}
    />
  );
};

export default FacebookLoginButton;
