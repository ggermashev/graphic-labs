import { ICurve } from "../interfaces/ICurve";
import { ILine } from "../interfaces/ILine";
import IVertex from "../interfaces/IVertex";
import DrawLine from "./DrawLine";
import { copyVertex, isEqual } from "./utils";

export function DrawBezierCurve(vertexes: IVertex[], color="white"): ICurve | undefined {
    if (vertexes.length !== 4) {
        alert("must be 4 points")
        return
    }

    const h = Math.max
    (
        Math.abs(vertexes[0].x - 2 * vertexes[1].x + vertexes[2].x) + Math.abs(vertexes[0].y - 2 * vertexes[1].y + vertexes[2].y),
        Math.abs(vertexes[1].x - 2 * vertexes[2].x + vertexes[3].x) + Math.abs(vertexes[1].y - 2 * vertexes[2].y + vertexes[3].y)
    )

    let v1;
    let v2 = copyVertex(vertexes[0])

    const lines: ILine[] = []

    for (let t = 0; t <= 1; t += 0.01) {
        v1 = copyVertex(v2)

        const c0 = (1-t)**3
        const c1 = 3 * t * (1-t)**2
        const c2 = 3 * t**2 * (1-t)
        const c3 = t**3
        const constants = [c0, c1, c2, c3]

        v2.x = Math.round(constants.reduce((res, c, j) => {return res + c * vertexes[j].x}, 0))
        v2.y = Math.round(constants.reduce((res, c, j) => {return res + c * vertexes[j].y}, 0))

        lines.push(DrawLine(v1, v2, color))
    }

    lines.push(DrawLine(v2, vertexes[3], color))

    return {
        id: Math.random(),
        lines,
        color
    } as ICurve
}