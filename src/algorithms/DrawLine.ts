import {IPixel} from "../interfaces/IPixel";
import IVertex from "../interfaces/IVertex";
import {ILine} from "../interfaces/ILine";


export default function DrawLine(start: IVertex, end: IVertex, color?: string): ILine {
    const pixels: IPixel[] = [];
    if (!color) {
        color = 'red';
    }

    if (start.x > end.x) {
        [start, end] = [end, start]
    }

    let x, y, ix, iy

    let dx = Math.abs(end.x - start.x)
    let dy = Math.abs(end.y - start.y)

    let swapped = false;

    x = start.x
    y = start.y
    ix = Math.sign(end.x - start.x)
    iy = Math.sign(end.y - start.y)

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
    const line: ILine = {
        vertexes: pixels,
        color: color
    };

    return line

}