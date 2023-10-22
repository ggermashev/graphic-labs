import {ILine} from "../interfaces/ILine";

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

    const x = (b2 - b1) / (k1 - k2)
    const y = k1 * x + b1

    console.log(x, y)

    if (x === start1.x && y === start1.y || x === start2.x && y === start2.y) {
        return false
    }

    return x >= Math.min(start1.x, end1.x) && x <= Math.max(start1.x, end1.x)
        && y >= Math.min(start1.y, end1.y) && y <= Math.max(start1.y, end1.y) &&
        x >= Math.min(start2.x, end2.x) && x <= Math.max(start2.x, end2.x)
        && y >= Math.min(start2.y, end2.y) && y <= Math.max(start2.y, end2.y)
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

    console.log(`intersecting in ${[x, y]}`)
    return {x, y}
}