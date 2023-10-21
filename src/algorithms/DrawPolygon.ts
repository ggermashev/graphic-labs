import IVertex from "../interfaces/IVertex";
import {IPixel} from "../interfaces/IPixel";
import DrawLine from "./DrawLine";
import {ILine} from "../interfaces/ILine";


export default function DrawPolygon(vertexes: IVertex[], color: string) {
    const firstVertex = vertexes[0];
    const lines: ILine[] = []
    let pixels: IPixel[] = []

    for (let i = 0; i < vertexes.length - 1; i++) {
        pixels = DrawLine(vertexes[i].x, vertexes[i].y, vertexes[i+1].x, vertexes[i+1].y, color)
        lines.push({vertexes: pixels, color: color})
    }
    let lastVertex = vertexes.at(-1);

    if (lastVertex && vertexes.length > 2) {
        pixels = DrawLine(firstVertex.x, firstVertex.y, lastVertex.x, lastVertex.y, color)
        lines.push({vertexes: pixels, color: color})
    }
    return lines;
}