import {IPixel} from "../interfaces/IPixel";


export default function DrawLine(x1: number, y1:number, x2: number, y2: number, color?: string): IPixel[] {
    const pixels: IPixel[] = [];
    if (!color) {
        color = 'red';
    }
    let x, y;
    let ix, iy;
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let swapped = false;

    if (dx >= dy) {
        x = x1;
        y = y1;
        ix = Math.sign(x2 - x1);
        iy = Math.sign(y2 - y1);
    } else {
        x = y1;
        y = x1;
        ix = Math.sign(y2 - y1);
        iy = Math.sign(x2 - x1);
        [dx, dy] = [dy, dx];
        swapped = true;
    }

    if (dx >= dy) {
        let err = 2 * dy - dx;
        for (let i = 0; i <= dx; i++) {
            if (!swapped) {
                pixels.push({x, y, color})
            } else {
                pixels.push({y, x, color})
            }
            if (err >= 0) {
                y += iy;
                err -= 2 * dx;
            }
            x += ix;
            err += 2 * dy;
        }
    }
    return pixels
}