import { useEffect } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

function PaintToolBar({ setPaintData }) {

    let colors = [
        "#FFF",
        "#C1C1C1",
        "#EF130B",
        "#FF7100",
        "#FFE400",
        "#00CC00",
        "#00B2FF",
        "#231FD3",
        "#A300BA",
        "#D37CAA",
        "#A0522D",

        "#000",
        "#4C4C4C",
        "#740B07",
        "#C23800",
        "#E8A200",
        "#005510",
        "#00569E",
        "#0E0865",
        "#550069",
        "#A75574",
        "#63300D"
    ];

    const colorSecondRowIndex = Math.floor(colors.length / 2);

    function Palette() {
        const handleSelectColor = (color) => {
            setPaintData({ lineWidth: 5, strokeStyle: color });
        };

        return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex" }}>
                    {colors.slice(0, colorSecondRowIndex).map(function (color, i) {
                        return <Box style={{ width: "24px", height: "24px", border: "1px solid black", backgroundColor: color }} key={i}
                            onClick={() => {handleSelectColor(color)}}
                        ></Box>
                    })}
                </Box>

                <Box sx={{ display: "flex" }}>
                    {colors.slice(colorSecondRowIndex, colors.length).map(function (color, i) {
                        return <Box style={{ width: "24px", height: "24px", border: "1px solid black", backgroundColor: color }} key={i}
                            onClick={() => {handleSelectColor(color)}}></Box>
                    })}
                </Box>
            </Box>
        )
    }

    return (
        <Container sx={{ display: "flex" }}>
            <Palette />
        </Container>
    );
};

export default PaintToolBar;
