import {IPolygon} from "../interfaces/IPolygon";
import {ILine} from "../interfaces/ILine";
import {TPointSide, areIntersecting, getPointSideForLine} from "./utils";
import IVertex from "../interfaces/IVertex";
import DrawLine from "./DrawLine";

export default function getPolygonType(polygon: IPolygon, toPrint=false) {
    return {
        isConvex: isConvex(polygon, toPrint),
        isSimple: isSimple(polygon)
    }
}

function isConvex(polygon: IPolygon, toPrint: boolean) {

    if (toPrint) {
        const vertexes = polygon.lines.map(line => line.vertexes[0])
        console.log(`vertexes: `, vertexes)
    }

    const vertexes = polygon.lines.map(line => line.vertexes[0])

    let initialSide = getPointSideForLine(vertexes[0], DrawLine(vertexes[1], vertexes[2]))

    for (let i = 1; i < vertexes.length; i++) {
        for (let j = 0; j < vertexes.length - 1; j++) {
            const side = getPointSideForLine(vertexes[i], DrawLine(vertexes[j], vertexes[j+1]))

            if (initialSide && ["right", "left"].includes(initialSide) && side && ["right", "left"].includes(side)) {
                if (side !== initialSide) {
                    if (toPrint) {
                        console.log(`vertex: ${i}; `, `line: ${j}-${j+1}`)
                    }
                    return false
                }
            }

            if (initialSide && !["right", "left"].includes(initialSide)) {
                initialSide = side
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
