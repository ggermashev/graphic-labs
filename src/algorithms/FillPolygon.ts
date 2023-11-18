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

    let x = 0;
    let y = 0;
    let intersectingPoints: IVertex[] = []

    const generateRay = () => {
        const length = right - left
        x = Math.random() * length + left
        y = top

        intersectingPoints = []

        for (let i = 0; i < lines.length; i++) {
            intersectingPoints.push(lines[i].vertexes[0])
            intersectingPoints.push(lines[i].vertexes.at(-1) || lines[i].vertexes[0])
            for (let j = i + 1; j < lines.length; j++) {
                if (areIntersecting(lines[i], lines[j])) {
                    intersectingPoints.push(getIntersectingPoint(lines[i], lines[j]))
                }
            }
        }
    }

    generateRay()

    const coloredVertexes: IPixel[] = []

    for (let vx = left; vx < right; vx++) {

        for (let vy = bottom; vy <top; vy++) {
            const vertex = {x: vx, y: vy}

            const fillColor = () => {
                let intersectingCount = 0;

                for (let line of lines) {
                    if (areIntersecting(line, {vertexes: [vertex, {x, y}]} as ILine)) {
                        const intersectingPoint = getIntersectingPoint(line, {vertexes: [vertex, {x, y}]} as ILine)
                        if (intersectingPoints.includes(intersectingPoint)) {
                            generateRay()
                            fillColor()
                            return
                        }
                        intersectingCount += 1
                    } 
                }

                if (intersectingCount % 2 !== 0) {
                    coloredVertexes.push({...vertex, color: color})
                }
            }

            fillColor()
        }
    }

    return coloredVertexes
}




export function fillNonZeroWinding(polygon: IPolygon, color: string) {

    if (!polygon) {
        return
    }
    const lines = polygon.lines
    const vertexes = lines.map(line => {
        return line.vertexes
    }).flat()

    const {left, top, right, bottom} = getPolygonBorders(polygon)

    let x = 0;
    let y = 0;
    let intersectingPoints: IVertex[] = []

    const generateRay = () => {
        const length = right - left
        x = Math.random() * length + left
        y = top

        intersectingPoints = []

        for (let i = 0; i < lines.length; i++) {
            intersectingPoints.push(lines[i].vertexes[0])
            intersectingPoints.push(lines[i].vertexes.at(-1) || lines[i].vertexes[0])
            for (let j = i + 1; j < lines.length; j++) {
                if (areIntersecting(lines[i], lines[j])) {
                    intersectingPoints.push(getIntersectingPoint(lines[i], lines[j]))
                }
            }
        }
    }

    generateRay()

    const coloredVertexes: IPixel[] = []

    for (let vx = left; vx < right; vx++) {

        for (let vy = bottom; vy < top; vy++) {
            const vertex = {x: vx, y: vy}

            const fillColor = () => {
                let windingNumber = 0;

                for (let line of lines) {
                    if (areIntersecting(line, {vertexes: [vertex, {x, y}]} as ILine)) {
                        const intersectingPoint = getIntersectingPoint(line, {vertexes: [vertex, {x, y}]} as ILine)
                        if (intersectingPoints.includes(intersectingPoint)) {
                            generateRay()
                            fillColor()
                            return
                        }
                        const side = getPointSideForLine(vertex, line)
                        if (side === "right") {
                            windingNumber += 1
                        } else if (side === "left") {
                            windingNumber -= 1
                        }
                    }
                }
                if (windingNumber !== 0) {
                    coloredVertexes.push({...vertex, color: color})
                }
            }

            fillColor()
        }
    }

    return coloredVertexes
}