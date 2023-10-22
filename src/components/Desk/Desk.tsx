import React, {useCallback, useEffect, useState} from 'react';
import {DeskStyled} from "./Desk.styled";
import {IPixel} from "../../interfaces/IPixel";
import Pixel from "../Pixel/Pixel";
import DrawLine from "../../algorithms/DrawLine";
import DrawPolygon from "../../algorithms/DrawPolygon";
import {ILine} from "../../interfaces/ILine";
import {IPolygon} from "../../interfaces/IPolygon";
import {getPolygonType} from "../../algorithms/GetPolygonType";
import {fillPolygonColor} from "../../algorithms/FillPolygon";

const Desk = () => {

    const [pixels, setPixels] = useState<IPixel[]>([])
    const [lines, setLines] = useState<ILine[]>([])
    const [polygons, setPolygons] = useState<IPolygon[]>([])

    const fillPolygon = useCallback(() => {
        const coloredPixels = (fillPolygonColor(polygons[0], "red", "even-odd") as IPixel[])
        setPixels(coloredPixels)
    }, [pixels, polygons])

    useEffect(() => {
        const polygon = (DrawPolygon([{x: 505, y: 505}, {x: 625, y:640}, {x: 725, y: 505}, {x: 505, y: 555}, {x: 725, y:555}], 'orange'))
        setPolygons([polygon])
    }, [])

    return (
        <DeskStyled>
            <button onClick={() => {fillPolygon()}}>Закрасить</button>
            <>
                {pixels.map(pixel => <Pixel x={pixel.x} y={pixel.y} color={pixel.color}/>)}
                {lines.map(line => {
                    return line.vertexes.map(pixel => <Pixel x={pixel.x} y={pixel.y} color={line.color}/>)
                })}
                {polygons.map(polygon => {
                    return polygon.lines.map(line => {
                        return line.vertexes.map(vertex => <Pixel x={vertex.x} y={vertex.y} color={polygon.color}/>)
                    })
                })}
            </>
        </DeskStyled>
    );
};

export default Desk;