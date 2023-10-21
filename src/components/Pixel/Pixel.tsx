import React, {FC, useEffect, useRef} from 'react';
import {PixelStyled} from "./Pixel.styled";
import {IPixel} from "../../interfaces/IPixel";


const Pixel: FC<IPixel> = ({x, y, color}) => {
    const pixelRef = useRef(null);

    useEffect(() => {
        //@ts-ignore
        pixelRef.current.style.left = `${x}px`;
        //@ts-ignore
        pixelRef.current.style.bottom = `${y}px`;
        //@ts-ignore
        pixelRef.current.style.backgroundColor = color;
    }, [])

    return (
        <PixelStyled
            ref={pixelRef}
        />
    );
};

export default Pixel;