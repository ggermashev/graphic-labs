import IVertex from "../interfaces/IVertex";
import {IPixel} from "../interfaces/IPixel";
import DrawLine from "./DrawLine";
import {ILine} from "../interfaces/ILine";
import {IPolygon} from "../interfaces/IPolygon";


export default function DrawPolygon(vertexes: IVertex[], color: string): IPolygon {
    const firstVertex = vertexes[0];
    const lines: ILine[] = []

    for (let i = 0; i < vertexes.length - 1; i++) {
        lines.push(DrawLine(vertexes[i], vertexes[i+1], color))
    }
    let lastVertex = vertexes.at(-1);

    if (lastVertex && vertexes.length > 2) {
        lines.push(DrawLine(lastVertex, firstVertex, color))
    }

    const polygon: IPolygon = {
        id: Math.random()*1e9,
        lines: lines,
        color: color
    }
    return polygon;
}