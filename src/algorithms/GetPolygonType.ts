import {IPolygon} from "../interfaces/IPolygon";
import {ILine} from "../interfaces/ILine";
import {areIntersecting} from "./utils";

export function getPolygonType(polygon: IPolygon) {
    return {
        isConvex: isConvex(polygon),
        isSimple: isSimple(polygon)
    }
}

function isConvex(polygon: IPolygon) {
    const lines = polygon.lines

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const start = line.vertexes[0]
        const end = line.vertexes.at(-1)

        if (!end) {
            continue
        }

        //y = kx + b
        const k = (end.y - start.y) / (end.x - start.x)
        const b = start.y - k * start.x

        let initialSide: "right" | "left" | undefined = undefined;

        for (let j = 0; j !== i && j < lines.length; j++) {
            const checkedLine = lines[j]

            for (let vertex of checkedLine.vertexes) {
                const delta = vertex.y - k * vertex.x - b
                if (delta === 0) {
                    continue
                }
                if (!initialSide) {
                    if (delta > 0) {
                        initialSide = "left"
                    } else {
                        initialSide = "right"
                    }
                }
                else {
                    let currSide: typeof initialSide
                    if (delta > 0) {
                        currSide = "left"
                    } else {
                        currSide = "right"
                    }
                    if (currSide !== initialSide) {
                        return false
                    }
                }
            }
        }
    }
    return true
}

function isSimple(polygon: IPolygon) {
    const lines = polygon.lines

    for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
            if (areIntersecting(lines[i], lines[j])) {
                return false
            }
        }
    }

    return true
}
