import {IPolygon} from "../interfaces/IPolygon";
import {
    areIntersecting,
    getIntersectingPoint,
    getPointSideForLine,
    getPolygonBorders,
} from "./utils";
import {ILine} from "../interfaces/ILine";
import IVertex from "../interfaces/IVertex";
import {IPixel} from "../interfaces/IPixel";

export function fillPolygonColor(polygon: IPolygon, color: string, algorithm: "even-odd" | "non-zero-winding") {
    switch (algorithm) {
        case "even-odd":
            return fillEvenOdd(polygon, color)
        case "non-zero-winding":
            return fillNonZeroWinding(polygon, color)
        default:
            throw new Error("Algorithm doesnt exist")
    }
}

function fillEvenOdd(polygon: IPolygon, color: string) {
    if (!polygon) {
        return
    }
    const lines = polygon.lines
    const vertexes = lines.map(line => {
        return line.vertexes
    }).flat()

    const {left, top, right, bottom} = getPolygonBorders(polygon)

    const coloredVertexes: IPixel[] = []

    for (let vx = left; vx < right; vx++) {

        for (let vy = bottom; vy <top; vy++) {
            const vertex = {x: vx, y: vy}
            let intersectingCount = 0

            for (const line of lines) {
                const edgeType = getEdgeType(vertex, line)

                if (edgeType === "touching") {
                    break;
                }

                if (edgeType === "cross_right" || edgeType === "cross_left") {
                    intersectingCount++
                }
            }

            if (intersectingCount % 2 !== 0) {
                coloredVertexes.push({...vertex, color})
            }
        }
    }

    return coloredVertexes
}




export function fillNonZeroWinding(polygon: IPolygon, color: string){

    if (!polygon) {
        return
    }
    const lines = polygon.lines
    const vertexes = lines.map(line => {
        return line.vertexes
    }).flat()

    const {left, top, right, bottom} = getPolygonBorders(polygon)
    
    const coloredVertexes: IPixel[] = []

    for (let vx = left; vx < right; vx++) {

        for (let vy = bottom; vy <top; vy++) {
            const vertex = {x: vx, y: vy}
            let intersectingCount = 0

            for (const line of lines) {
                const edgeType = getEdgeType(vertex, line)

                if (edgeType === "touching") {
                    break;
                }

                if (edgeType === "cross_left") {
                    intersectingCount--
                }

                if (edgeType === "cross_right" ) {
                    intersectingCount++
                }
            }

            if (intersectingCount !== 0) {
                coloredVertexes.push({...vertex, color})
            }
        }
    }

    return coloredVertexes
}

function getEdgeType(checked: IVertex, edge: ILine): undefined | "cross_right" | "cross_left" | "inessential" | "touching" {
    const start = edge.vertexes[0]
    const end = edge.vertexes.at(-1)

    if (!end) {
        return
    }

    if (getPointSideForLine(checked, edge) === "left") {
        if (checked.y > start.y && checked.y <= end.y) {
            return "cross_left"
        } else {
            return "inessential"
        }
    }

    if (getPointSideForLine(checked, edge) === "right") {
        if (checked.y > end.y && checked.y <= start.y) {
            return "cross_right"
        } else {
            return "inessential"
        }
    }

    if (getPointSideForLine(checked, edge) === "destination") {
        return "touching"
    }

    return "inessential"
}