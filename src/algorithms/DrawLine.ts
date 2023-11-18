import {IPixel} from "../interfaces/IPixel";
import IVertex from "../interfaces/IVertex";
import {ILine} from "../interfaces/ILine";
import { isEqual } from "./utils";


export default function DrawLine(start: IVertex, end: IVertex, color?: string): ILine {
    const savedEnd = end

    let pixels: IPixel[] = [];

    if (!color) {
        color = 'red';
    }

    if (start.x > end.x) {
        [start, end] = [end, start]
    }

    let dx = Math.abs(end.x - start.x)
    let dy = Math.abs(end.y - start.y)

    let x = start.x
    let y = start.y
    let ix = Math.sign(end.x - start.x)
    let iy = Math.sign(end.y - start.y)

    let swapped = false;

    if (dy > dx) {
        [x, y] = [y, x];
        [ix, iy] = [iy, ix];
        [dx, dy] = [dy, dx];
        swapped = true
    }

    let error = 2 * dy - dx

    for (let i = 0; i <= dx; i++) {
        if (!swapped) {
            pixels.push({x, y, color})
        } else {
            pixels.push({x: y, y: x, color})
        }

        if (error >= 0) {
            y += iy
            error -= 2 * dx
        }
        x += ix
        error += 2 * dy
    }

    if (isEqual(pixels[0], savedEnd)) {
        pixels = pixels.reverse()
    }

    const line: ILine = {
        id: Math.random(),
        vertexes: pixels,
        color: color
    };

    return line

}