export interface IVertex3 {
    x: number;
    y: number;
    z: number
}

type TDegree = number

export class Vertex3 {
    x: number
    y: number
    z: number
    
    constructor(vertex: IVertex3) {
        this.x = vertex.x
        this.y = vertex.y
        this.z = vertex.z
    }

    rotate(phi: TDegree, r: Vertex3) {
        phi *= Math.PI / 180
        const cos = Math.cos(phi)
        const sin = Math.sin(phi)
        const cos_dif = 2*(Math.sin(phi/2))**2

        const len = (r.x**2 + r.y**2 + r.z**2) ** (1/2)
        const {x ,y ,z} = Vertex3.divide(r, len)

        this.x = this.x * (cos + x**2 * cos_dif) +
            this.y *(x*y*cos_dif - z*sin) +
            this.z *(x*z*cos_dif + y*sin)

        this.y = this.x * (x*y*cos_dif + z*sin) +
            this.y *(cos + y**2 * cos_dif) +
            this.z *(y*z * cos_dif - x*sin)

        this.z = this.x * (x*z*cos_dif - y*sin) +
            this.y *(y*z*cos_dif + x*sin) +
            this.z *(cos + z**2 * cos_dif)

    }

    copy() {
        return new Vertex3({
            x: this.x,
            y: this.y,
            z: this.z
        })
    }

    static substract(from: IVertex3, ...values: IVertex3[]): Vertex3 {
        const res = new Vertex3(from)

        values.forEach(value => {
            res.x -= value.x
            res.y -= value.y
            res.z -= value.z
        })

        return res
    }

    static sum(to: IVertex3, ...values: IVertex3[]): Vertex3 {
        const res = new Vertex3(to)

        values.forEach(value => {
            res.x += value.x
            res.y += value.y
            res.z += value.z
        })

        return res
    }

    static divide(vertex: Vertex3, value: number) {
        return new Vertex3({x: vertex.x / value, y: vertex.y / value, z: vertex.z /value})
    }

    static isEqual(v1: Vertex3, v2: Vertex3, delta=1e-6) {
        return Math.abs(v1.x - v2.x) < delta && Math.abs(v1.y - v2.y) < delta && Math.abs(v1.z - v2.z) < delta
    }


    static getDistance(v1: Vertex3, v2: Vertex3) {
        const sub = Vertex3.substract(v1, v2)
        return (sub.x**2 + sub.y**2 + sub.z**2) ** (1/2)
    }
    
}