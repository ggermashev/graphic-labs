import {IPolygon} from "../interfaces/IPolygon"
import { ILine } from "../interfaces/ILine"
import getPolygonType from "./GetPolygonType"
import DrawLine from "./DrawLine"
import { getPointSideForLine } from "./utils"
import DrawPolygon from "./DrawPolygon"
import { IPixel } from "../interfaces/IPixel"
import {isEqual} from "./utils"
import IVertex from "../interfaces/IVertex"

export default function getConvexBounding(polygon: IPolygon, color="red"): IPolygon | undefined {

    if (!getPolygonType(polygon).isSimple) {
        alert("polygon should be simple")
        return
    }

    const convexPolygon: IPolygon = {
        id: Math.random(),
        lines: [] as ILine[],
        color: color
    }

    let vertexes = polygon.lines.map(line => line.vertexes[0])

    //нижняя левая
    const minY = Math.min(...vertexes.map(vertex => vertex.y))
    let bestVertexes = vertexes.filter(v => v.y === minY)
    const minX = Math.min(...bestVertexes.map(vertex => vertex.x))
    let bestVertex = bestVertexes.filter(v => v.x === minX)[0]

    const polygonVertexes = [bestVertex] as IPixel[]

    while (polygonVertexes.length < 3 || polygonVertexes[0] !== polygonVertexes.at(-1)) {
        for (let i = 0; i < vertexes.length; i++) {
            if (vertexes[i] === polygonVertexes.at(-1)) {
                continue
            }

            const first = polygonVertexes.at(-1)
            if (!first) {
                continue
            }

            const line = DrawLine(first, vertexes[i])

            let flag = true
            for (let j = 0; j < vertexes.length; j++)  {
                if (i === j) {
                    continue
                }

                const side = getPointSideForLine(vertexes[j], line)

                if (side === "right") {
                    flag = false
                    break;
                }
            }

            if (flag) {
                polygonVertexes.push(vertexes[i])
                vertexes = vertexes.filter((v,num) => num !== i )
                break;
            }
        }
    }

    return DrawPolygon(polygonVertexes.slice(0,-1), color)

}

