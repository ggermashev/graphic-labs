import { ILine } from "../interfaces/ILine";
import { IPolygon } from "../interfaces/IPolygon";
import DrawLine from "./DrawLine";
import { getPolygonType } from "./GetPolygonType";
import { areIntersecting, areParallel, getLinesIntersectionType, getPointSideForLine, getPolygonBorders, isPolygonClockWise } from "./utils";

export function CyrusBeckClipLine(line: ILine, polygon: IPolygon): ILine | undefined {
    const n = polygon.lines.length

    if (!getPolygonType(polygon).isConvex) {
        return;
    }

    if (!isPolygonClockWise(polygon)) {
        polygon.lines.forEach(line => line.vertexes = line.vertexes.reverse())
    }

    let t1 = 0
    let t2 = 1;
    let t = 0;

    const start = line.vertexes[0]
    const end = line.vertexes.at(-1)

    if (!end) {
        return
    }

    const x1 = start.x
    const x2 = end.x
    const sx = x2 - x1

    const y1 = start.y
    const y2 = end.y
    const sy = y2 - y1

    let nx, ny, denom, num, x1_new, y1_new, x2_new, y2_new

    for (let i = 0; i < n - 1; i++) {

        if (!areIntersecting(line, polygon.lines[i])) {
            continue
        }

        const linesIntersectionType = getLinesIntersectionType(line, polygon.lines[i])

        if (linesIntersectionType === "same") {
            return
        }

        if (linesIntersectionType === "parallel") {
            if (getPointSideForLine(start, polygon.lines[i]) === "left") {
                return;
            }
        }

        const first = polygon.lines[i].vertexes[0]
        const last = polygon.lines[i].vertexes.at(-1)
        if (!last) {
            return
        }
        nx = last.y - first.y
        ny = first.x - last.x

        denom = nx * sx + ny * sy
        num = nx * (x1 - first.x) + ny * (y1 - first.y)

        const t = -num / denom

        if (denom > 0) {
            t1 = Math.max(t, t1)
        } else {
            t2 = Math.min(t, t2)
        }
        
    }

    if (t1 < t2) {
        x1_new = Math.round(x1 + t1 * (x2 - x1))
        y1_new = Math.round(y1 + t1 * (y2 - y1))
    
        x2_new = Math.round(x1 + t2 * (x2 - x1))
        y2_new = Math.round(y1 + t2 * (y2 - y1))
    
    
        return DrawLine({x: x1_new, y: y1_new}, {x: x2_new, y: y2_new}, line.color)
    }

}