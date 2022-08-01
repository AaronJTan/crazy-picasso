import "./GameBar.css"
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";

const GameBar = ({ socketRef, username, currentDrawerUsername, word, choiceOfWords, setChoiceOfWords }) => {

  const isCurrentDrawer = () => {
    return currentDrawerUsername == username
  }

  const handleWordDisplay = () => {
    if (isCurrentDrawer()) {
      return word;
    }

    return wordToDashes();
  }

  const wordToDashes = () => {
    const reg = /./g;
    const dashes = word.replace(reg, "  _  ");

    return dashes;
  }

  const handleWordSelection = (wordToDraw) => {
    socketRef.current.emit("drawer_selected_word", wordToDraw);
    setChoiceOfWords([]);
  }

  const renderWordChoices = () => {
    return (
      <Paper className="word-selection" elevation={10} sx={{ p: 1, mt: 3, mb: 2 }}>
        <h3 className="no-margin">Choose a Word</h3>

        <Box className="word-choices">
          {
            choiceOfWords.map((wordChoice, index) => {
              return <button key={index} onClick={() => handleWordSelection(wordChoice)}>{wordChoice}</button>
            })
          }
        </Box>
      </Paper>
    )
  }

  return (
    <>
      <Paper className="game-bar" elevation={10} sx={{ p: 1, mt: 3, mb: 2 }}>
        <Box className="round-data">
          <h3 className="no-margin">
            Round 1 of 3
          </h3>
        </Box>

        <Box>
          <h2 className="no-margin">{handleWordDisplay()}</h2>
        </Box>
      </Paper>

      {(choiceOfWords.length > 0 && isCurrentDrawer()) && renderWordChoices()}
    </>
  );
}

export default GameBar;