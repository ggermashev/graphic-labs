import {IPixel} from "../../interfaces/IPixel";
import {ILine} from "../../interfaces/ILine";
import {IPolygon} from "../../interfaces/IPolygon";
import { ICurve } from '../../interfaces/ICurve';
import { Cube } from "../../interfaces/ICube";


export type TEditMode = "line" | "polygon" | "bezier_curve" | "hermite_curve" | "cube" | "vector" | undefined

export interface ILineMenu {
    pixels: IPixel[],
    setPixels: (val: IPixel[]) => void,
    lines: ILine[],
    setLines: (val: ILine[]) => void,
    isVisible: boolean,
    setIsVisible: (val: boolean) => void,
    lineId: number,
    clearCanvas: (left: number, top: number, width: number, height: number) => void,
    setIsClipping: (clipping: boolean) => void,
    setIsEditing: (isEditing: boolean) => void,
    setEditMode: (editMode: TEditMode) => void
}

export interface IPolygonMenu {
    pixels: IPixel[],
    setPixels: (val: IPixel[]) => void,
    polygonId: number,
    polygons: IPolygon[],
    setPolygons: (val: IPolygon[]) => void,
    isVisible: boolean,
    setIsVisible: (val: boolean) => void,
    clearCanvas: (left: number, top: number, width: number, height: number) => void
}

export interface ICurveMenu {
    isVisible: boolean,
    setIsVisible: (visible: boolean) => void,
    curveId: number,
    curves: ICurve[],
    setCurves: (curves: ICurve[]) => void,
    clearCanvas: (left: number, top: number, width: number, height: number) => void,
    pixels: IPixel[],
    setPixels: (val: IPixel[]) => void,
}

export interface ICubeMenu {
    isVisible: boolean,
    setIsVisible: (visible: boolean) => void,
    setEditMode: (mode: TEditMode) => void,
    setIsEditing: (isEditing: boolean) => void,
    cubeId: number,
    cubes: Cube[],
    setCubes: (cubes: Cube[]) => void
    rotateIntervals: Record<string, NodeJS.Timer | undefined>,
    setRotateIntervals: (intervals: Record<string, NodeJS.Timer | undefined>) => void
    hideFacesCubeIds: string[],
    setHideFacesCubeIds: (val: string[]) => void,
    showProjectionCubeIds: string[],
    setShowProjectionCubeIds: (val: string[]) => void,
    clearCanvas: (left: number, top: number, width: number, height: number) => void,
    pixels: IPixel[],
    setPixels: (val: IPixel[]) => void,
}

export interface IDrawMenu {
    isVisible: boolean,
    setIsVisible: (visible: boolean) => void
    setEditMode: (mode: TEditMode) => void,
    setIsEditing: (isEditing: boolean) => void
}