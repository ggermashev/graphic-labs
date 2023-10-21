import React, {useEffect, useState} from 'react';
import {DeskStyled} from "./Desk.styled";
import {IPixel} from "../../interfaces/IPixel";
import Pixel from "../Pixel/Pixel";
import DrawLine from "../../algorithms/DrawLine";
import DrawPolygon from "../../algorithms/DrawPolygon";
import {ILine} from "../../interfaces/ILine";

const Desk = () => {

    const [pixels, setPixels] = useState<IPixel[]>([])
    const [lines, setLines] = useState<ILine[]>([])

    useEffect(() => {

        const polygon = (DrawPolygon([{x: 50, y: 50}, {x: 100, y: 100}, {x: 0, y:200}], 'green'))
        console.log(polygon)
        setLines([...polygon])
    }, [])

    return (
        <DeskStyled>
            <>
                {pixels.map(pixel => <Pixel x={pixel.x} y={pixel.y} color={pixel.color}/>)}
                {lines.map(line => {
                    return line.vertexes.map(pixel => <Pixel x={pixel.x} y={pixel.y} color={line.color}/>)
                })}
            </>
        </DeskStyled>
    );
};

export default Desk;