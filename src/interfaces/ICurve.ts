import { ILine } from "./ILine";

export interface ICurve {
    id: number
    lines: ILine[],
    color: string,
}