import { ICurve } from "../interfaces/ICurve";
import { ILine } from "../interfaces/ILine";
import IVertex from "../interfaces/IVertex";
import DrawLine from "./DrawLine";
import { copyVertex } from "./utils";


export type IVector = {
    origin: IVertex,
    destination: IVertex
}


export default function drawHermiteCompoundCurve(vectors: IVector[], color="white"): ICurve | undefined {
    if (vectors.length < 2) {
        alert("should be at least 2 vectors for drawing hermite compound curve")
        return;
    }

    const lines: ILine[] = []

    let vec1 = vectors[0]
    let vec2;

    for (let i = 1; i < vectors.length; i++) {
        if (vec2) {
            vec1 = vec2
        }
        vec2 = vectors[i]

        let v1 = vec1.origin
        let v2 = copyVertex(v1)

        for (let t = 0; t <= 1; t += 0.001) {
            v1 = copyVertex(v2)

            const c0 = 1 - 3 * t**2 + 2 * t**3
            const c1 = t**2 * (3 - 2*t)
            const c2 = t * (1 - 2*t + t**2)
            const c3 = t**3 - t**2

            let q1x = vec1.destination.x - vec1.origin.x
            let q1y = vec1.destination.y - vec1.origin.y

            let q2x = vec2.destination.x - vec2.origin.x
            let q2y = vec2.destination.y - vec2.origin.y

            v2.x = Math.round(c0 * vec1.origin.x + c1 * vec2.origin.x + c2 * q1x + c3 * q2x)
            v2.y = Math.round(c0 * vec1.origin.y + c1 * vec2.origin.y + c2 * q1y + c3 * q2y)

            lines.push(DrawLine(v1, v2))
        }
    }

    return {
        id: Math.random(),
        lines,
        color
    } 
}