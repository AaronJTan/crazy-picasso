import { Typography } from "@mui/material";
import { generateSlug } from "random-word-slugs";



const RandomWords = () => {
  const slug = generateSlug(1, {format: 'lower', categories:{noun: ["animals"]}});
  const reg = /./g;
  const wordHidden = slug.replace(reg, "  _  ");
  return (
    <>
      <h1>{slug}</h1>
      <h1>{wordHidden}</h1>
    </>
  );
}
 
export default RandomWords;