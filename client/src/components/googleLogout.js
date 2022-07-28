import { GoogleLogout } from 'react-google-login';

const CLIENT_ID = "219662561135-pm8u2seq0jn6h9bebu6j86jlrjv8pmsi.apps.googleusercontent.com"

export default function GoogleLogoutButton() {
  const onSuccess = (res) => {
    console.log("Logout successful!");
  }
  
  return (
    <div id="googleSignOutButton">
      <GoogleLogout
        clientId = {CLIENT_ID}
        buttonText = {"Logout"}
        onLogoutSuccess={onSuccess}
      />
    </div>
  )
}
