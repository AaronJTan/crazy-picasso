const API_URL = (process.env.NODE_ENV == "production") ?
    "http://crazypicasso.me/api" :
    `${process.env.REACT_APP_SERVER_URL}/api`;

export default API_URL