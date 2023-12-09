import { Vertex3 } from "./IVertex3";
import { ILine } from "./ILine";
import DrawLine from "../algorithms/DrawLine";
import { getPolygonBorders, isEqual } from "../algorithms/utils";
import { IPolygon } from "./IPolygon";

export interface IFace {
    vertexes: Vertex3[]
    center?: Vertex3
    n?: Vertex3
}

type TDegree = number

export class Face implements IFace {
    vertexes: Vertex3[];
    center: Vertex3;
    n?: Vertex3;

    constructor(face: IFace) {
        this.vertexes = [...face.vertexes]

        if (face.center) {
            this.center = face.center
        } else {
            this.center = new Vertex3({x: 0, y: 0, z: 0})
            this.center = Vertex3.sum(this.center, ...face.vertexes)
            this.center = Vertex3.divide(this.center, 4)
        }
        
        if (face.n) {
            this.n = face.n
        }

    }

    
}


export class Cube {
    id: number
    faces: Face[] = []
    center: Vertex3
    hideFaces: boolean
    showProjection: boolean
    rotateDirection?: Vertex3

    constructor(origin: Vertex3, length: number, width: number, height: number) {
        this.id = Math.random()
        this.hideFaces = false
        this.showProjection = false

        const low1 = new Vertex3({...origin})
        const low2 = new Vertex3({...origin, y: origin.y + width})
        const low3 = new Vertex3({...origin, x: origin.x + length, y: origin.y + width})
        const low4 = new Vertex3({...origin, x: origin.x + length})
        
        const [high1, high2, high3, high4] = [low1, low2, low3, low4].map((v: Vertex3) => (new Vertex3({...v, z: v.z + height})))

        this.faces.push(new Face({vertexes: [low1.copy(),low2.copy(),low3.copy(),low4.copy()]}))
        this.faces.push(new Face({vertexes: [high1.copy(), high2.copy(), high3.copy(), high4.copy()]}))

        this.faces.push(new Face({vertexes: [low1.copy(), low2.copy(), high2.copy(), high1.copy()]}))
        this.faces.push(new Face({vertexes: [low2.copy(), low3.copy(), high3.copy(), high2.copy()]}))
        this.faces.push(new Face({vertexes: [low3.copy(), low4.copy(), high4.copy(), high3.copy()]}))
        this.faces.push(new Face({vertexes: [low4.copy(), low1.copy(), high1.copy(), high4.copy()]}))

        this.center = new Vertex3({ x: origin.x + length/2, y: origin.y + width/2, z: origin.z + height/2 })
        this.calcNormals()
    }

    rotate(phi: TDegree, r: Vertex3) {
        this.rotateDirection = r

        this.center.rotate(phi, r)

        this.faces.forEach(face => {
            face.center.rotate(phi, r)

            face.vertexes.forEach(v => {
                v.rotate(phi, r)
            })
        })

        this.calcNormals()
    }

    getOnePointProjection(k: number) {
        const lines: ILine[] = []

        const faceVertexes = this.faces.map(face => {
            if (!this.hideFaces) {
                return face.vertexes
            } else {
                if (face.n && face.n.y > 0) {
                    return face.vertexes
                } else {
                    return []
                }
            }
            
        })

        const projVertexes: Vertex3[][] = []

        faceVertexes.forEach(vertexes => {
            const projvs: Vertex3[] = []
            vertexes.forEach(v => {
                projvs.push(Vertex3.divide(v, (1 + k * v.z)))
            })
            projVertexes.push(projvs)
        })
        
        projVertexes.forEach(vertexes => {
            if (vertexes.length > 0) {
                lines.push(DrawLine(
                    {
                        x: vertexes[0].x,
                        y: vertexes[0].z
                    },
                    {
                        x: vertexes[1].x,
                        y: vertexes[1].z
                    },
                ))
                lines.push(DrawLine(
                    {
                        x: vertexes[1].x,
                        y: vertexes[1].z
                    },
                    {
                        x: vertexes[2].x,
                        y: vertexes[2].z
                    },
                ))
                lines.push(DrawLine(
                    {
                        x: vertexes[2].x,
                        y: vertexes[2].z
                    },
                    {
                        x: vertexes[3].x,
                        y: vertexes[3].z
                    },
                ))
                lines.push(DrawLine(
                    {
                        x: vertexes[3].x,
                        y: vertexes[3].z
                    },
                    {
                        x: vertexes[0].x,
                        y: vertexes[0].z
                    },
                ))
            }
            
        })

        return lines
    }

    calcNormals() {
        this.faces.forEach(face => face.n = Vertex3.substract(this.center, face.center))
    }

    getLines(): ILine[] {
        const lines: ILine[] = []

        const faceVertexes = this.faces.map(face => {
            if (!this.hideFaces) {
                return face.vertexes
            } else {
                if (face.n && face.n.y >= 0) {
                    return face.vertexes
                } else {
                    return []
                }
            }
            
        })
        
        faceVertexes.forEach(vertexes => {
            if (vertexes.length > 0) {
                lines.push(DrawLine(
                    {
                        x: vertexes[0].x,
                        y: vertexes[0].z
                    },
                    {
                        x: vertexes[1].x,
                        y: vertexes[1].z
                    },
                ))
                lines.push(DrawLine(
                    {
                        x: vertexes[1].x,
                        y: vertexes[1].z
                    },
                    {
                        x: vertexes[2].x,
                        y: vertexes[2].z
                    },
                ))
                lines.push(DrawLine(
                    {
                        x: vertexes[2].x,
                        y: vertexes[2].z
                    },
                    {
                        x: vertexes[3].x,
                        y: vertexes[3].z
                    },
                ))
                lines.push(DrawLine(
                    {
                        x: vertexes[3].x,
                        y: vertexes[3].z
                    },
                    {
                        x: vertexes[0].x,
                        y: vertexes[0].z
                    },
                ))
            }
            
        })

        return lines
    }

    getBorders() {
        const lines: ILine[] = []

        const faceVertexes = this.faces.map(face => face.vertexes)
        
        faceVertexes.forEach(vertexes => {
            lines.push(DrawLine(
                {
                    x: vertexes[0].x,
                    y: vertexes[0].z
                 },
                 {
                    x: vertexes[1].x,
                    y: vertexes[1].z
                 },
            ))
            lines.push(DrawLine(
                {
                    x: vertexes[1].x,
                    y: vertexes[1].z
                 },
                 {
                    x: vertexes[2].x,
                    y: vertexes[2].z
                 },
            ))
            lines.push(DrawLine(
                {
                    x: vertexes[2].x,
                    y: vertexes[2].z
                 },
                 {
                    x: vertexes[3].x,
                    y: vertexes[3].z
                 },
            ))
            lines.push(DrawLine(
                {
                    x: vertexes[3].x,
                    y: vertexes[3].z
                 },
                 {
                    x: vertexes[0].x,
                    y: vertexes[0].z
                 },
            ))
        })

        const borders = lines.map(line => getPolygonBorders({lines: [line]} as IPolygon))
        const left = Math.min(...borders.map(border => border.left))
        const right = Math.max(...borders.map(border => border.right))
        const top = Math.max(...borders.map(border => border.top))
        const bottom = Math.min(...borders.map(border => border.bottom))

        return {left, top, right, bottom}
    }
}