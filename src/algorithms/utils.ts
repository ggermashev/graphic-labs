import {ILine} from "../interfaces/ILine";
import {IPolygon} from "../interfaces/IPolygon";
import {IPixel} from "../interfaces/IPixel";
import IVertex from "../interfaces/IVertex";

export function areIntersecting(line1: ILine, line2: ILine) {
    const start1 = line1.vertexes[0]
    const end1 = line1.vertexes.at(-1)

    const start2 = line2.vertexes[0]
    const end2 = line2.vertexes.at(-1)

    if (!end1 || !end2) {
        return false
    }

    const k1 = (end1.y - start1.y) / (end1.x - start1.x)
    const b1 = start1.y - k1 * start1.x

    const k2 = (end2.y - start2.y) / (end2.x - start2.x)
    const b2 = start2.y - k2 * start2.x

    const x_ = (b2 - b1) / (k1 - k2)
    const y_ = (k1 * x_ + b1)

    const d = 1e-8
    for (let x = x_- d; x < x_ + d; x += d) {
        for (let y = y_ -d; y < y_ + d; y += d) {

            if (Math.abs(x - start1.x) < d && Math.abs(y - start1.y) < d || Math.abs(x - start2.x) < d && Math.abs(y - start2.y) < d) {
                return false
            }
        
            if (x >= Math.min(start1.x, end1.x) && x <= Math.max(start1.x, end1.x) 
            && y >= Math.min(start1.y, end1.y) && y <= Math.max(start1.y, end1.y) 
            && x >= Math.min(start2.x, end2.x) && x <= Math.max(start2.x, end2.x)
            && y >= Math.min(start2.y, end2.y) && y <= Math.max(start2.y, end2.y)) {
                return true
            }
        }
    }

    return false
    
}

export function getIntersectingPoint(line1: ILine, line2: ILine) {
    const start1 = line1.vertexes[0]
    const end1 = line1.vertexes.at(-1)

    const start2 = line2.vertexes[0]
    const end2 = line2.vertexes.at(-1)

    if (!end1 || !end2) {
        throw new Error()
    }

    const k1 = (end1.y - start1.y) / (end1.x - start1.x)
    const b1 = start1.y - k1 * start1.x

    const k2 = (end2.y - start2.y) / (end2.x - start2.x)
    const b2 = start2.y - k2 * start2.x

    const x = (b2 - b1) / (k1 - k2)
    const y = k1 * x + b1

    return {x, y}
}

export function getPolygonBorders(polygon: IPolygon) {
    const lines = polygon.lines
    const vertexes = lines.map(line => line.vertexes).flat()

    const left = Math.min(...vertexes.map(vertex => vertex.x))
    const top = Math.max(...vertexes.map(vertex => vertex.y))
    const right = Math.max(...vertexes.map(vertex => vertex.x))
    const bottom = Math.min(...vertexes.map(vertex => vertex.y))

    return {left, top, right, bottom}
}

export function getPointSideForLine(pixel: IVertex, line: ILine): "right" | "left" | null {
    const start = line.vertexes[0]
    const end = line.vertexes.at(-1)

    if (!end) {
        throw new Error("line has no points")
    }

    const ax = end.x - start.x 
    const ay = end.y - start.y 
    const bx = pixel.x - start.x 
    const by = pixel.y - start.y

    const s = ax * by - bx * ay

    if (s > 0) {
        return "left"
    } else {
        return "right"
    }
    
}

export function isEqual(vertex1: IVertex, vertex2: IVertex) {
    const delta = 1e-6
    return Math.abs(vertex1.x - vertex2.x) < delta && Math.abs(vertex1.y - vertex2.y) < delta
}