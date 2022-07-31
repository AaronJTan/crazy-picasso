import "./GameBar.css"
import Paper from "@mui/material/Paper";
import { generateSlug } from "random-word-slugs";
import { Box } from "@mui/material";


const GameBar = () => {
  const slug = generateSlug(1, { format: 'lower', categories: { noun: ["animals"] } });
  const reg = /./g;
  const wordHidden = slug.replace(reg, "  _  ");

  return (
    <Paper className="game-bar" elevation={10} sx={{ p: 1, mt: 3, mb: 2 }}>
      <Box className="round-data">
        <h3 className="no-margin">
          Round 1 of 3
        </h3>
      </Box>

      <Box>
        <h2 className="no-margin">{wordHidden}</h2>
      </Box>
    </Paper>
  );
}

export default GameBar;