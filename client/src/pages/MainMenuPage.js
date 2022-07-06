const MainMenuPage = () => {
  return ( 
    <div className="home-btn-container">
    <Button className="home-btn" id='private-btn' variant="contained">
      Create Private
    </Button>
    <Button className="home-btn" id='public-btn' variant="contained" onClick={() => window.location.href="/public"}>
      Join Public
    </Button>
  </div>
  );
}
 
export default MainMenuPage;