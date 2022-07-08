import { useEffect } from 'react';

function Canvas() {

    useEffect(() => {
        handleCanvasActions();
    }, [])

    const handleCanvasActions = () => {
        const canvas = document.querySelector('#board');
        const ctx = canvas.getContext('2d');
        const mouseData = { x: 0, y: 0, previousX: 0, previousY: 0 };
        const paintData = { lineWidth: 5, strokeStyle: 'green'};
        const clearScreenBtn = document.querySelector('#clear-screen');

        const handleCanvasMouseXY = (e) => {
            mouseData.previousX = mouseData.x;
            mouseData.previousY = mouseData.y;

            mouseData.x = e.pageX - canvas.offsetLeft;
            mouseData.y = e.pageY - canvas.offsetTop;
        }

        canvas.addEventListener('mousemove', handleCanvasMouseXY);        

        canvas.addEventListener('mousedown', function (e) {
            canvas.addEventListener('mousemove', draw);
        });

        canvas.addEventListener('mouseup', function () {
            canvas.removeEventListener('mousemove', draw);
        });

        const draw = () => {
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = paintData.lineWidth;
            ctx.strokeStyle = paintData.strokeStyle;
            ctx.beginPath();
            ctx.moveTo(mouseData.previousX, mouseData.previousY);
            ctx.lineTo(mouseData.x, mouseData.y);
            ctx.closePath();
            ctx.stroke();
        };

        const erase = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        clearScreenBtn.addEventListener('click', erase);
    }

    return (
        <>
            <canvas className='board' id='board' width={800} height={600} style={{ backgroundColor: 'red' }} />
            <input type='button' value='Clear Screen' id='clear-screen' style={{ position: 'absolute', left: '5%' }} />
        </>
    );
};

export default Canvas;
