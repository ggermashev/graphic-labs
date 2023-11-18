import EditIcon from '@mui/icons-material/Edit';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {DeskStyled, Box, MenuStyled, FillMenu, DeleteMenu, TypeMenu} from "./Desk.styled";
import {IPixel} from "../../interfaces/IPixel";
import DrawPolygon from "../../algorithms/DrawPolygon";
import {ILine} from "../../interfaces/ILine";
import {IPolygon} from "../../interfaces/IPolygon";
import {fillPolygonColor} from "../../algorithms/FillPolygon";
import {getPolygonBorders, getCurveBorders} from "../../algorithms/utils";
import ModalWindow from "../ModalWindow/ModalWindow";
import Button from "../../ui/Button/Button";
import {getPolygonType} from "../../algorithms/GetPolygonType";
import { HexColorPicker } from "react-colorful";
import Select from '../../ui/Select/Select';
import Pixel from '../Pixel/Pixel';
import DrawLine from '../../algorithms/DrawLine';
import { DrawBezierCurve } from '../../algorithms/DrawBezierCurve';
import { ICurve } from '../../interfaces/ICurve';
import { CyrusBeckClipLine } from '../../algorithms/CyrusBeckClipLine';

type TEditMode = "line" | "polygon" | "curve" | undefined


interface ILineMenu {
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

const LineMenu: FC<ILineMenu> =({pixels, setPixels, lines, setLines, isVisible, setIsVisible, lineId, clearCanvas, setIsClipping, setIsEditing, setEditMode}) => {

    return (
        <ModalWindow isVisible={isVisible} setIsVisible={setIsVisible}>
            <MenuStyled>
                
                <DeleteMenu style={{margin: "0 auto"}}>
                    {/* Удалить */}
                    <Button onClick={() => {
                        const line = lines.filter(line => line.id === lineId)[0]
                        const {left, top, right, bottom} = getPolygonBorders({lines: [line]} as IPolygon)
                        const width = right - left
                        const height = bottom - top
                        clearCanvas(left, top, width, height)
                        setLines(lines.filter(line => line.id !== lineId))
                        setPixels(pixels.filter(pixel => {
                            return (pixel.x < left || pixel.x > right) && (pixel.y < top || pixel.y > bottom)
                        }))
                        setIsVisible(false)
                    }}>
                        Удалить
                    </Button>
                </DeleteMenu>

                <div style={{margin: "0 auto"}}>
                    <Button onClick={() => {
                        setIsClipping(true)
                        setIsEditing(true)
                        setEditMode("polygon")
                        setIsVisible(false)
                    }}>
                        Отсечь полигоном
                    </Button>
                </div>
            </MenuStyled>
        </ModalWindow>
    )
}


interface IPolygonMenu {
    pixels: IPixel[],
    setPixels: (val: IPixel[]) => void,
    polygons: IPolygon[],
    setPolygons: (val: IPolygon[]) => void,
    isVisible: boolean,
    setIsVisible: (val: boolean) => void,
    polygonId: number,
    clearCanvas: (left: number, top: number, width: number, height: number) => void
}

const PolygonMenu: FC<IPolygonMenu> =({pixels, setPixels, polygons, setPolygons, isVisible, setIsVisible, polygonId, clearCanvas}) => {

    const fillPolygon = useCallback((polygon: IPolygon, color: string, algorithm: "even-odd" | "non-zero-winding") => {
        const coloredPixels = (fillPolygonColor(polygon, color, algorithm) as IPixel[])
        setPixels(coloredPixels)
    }, [pixels, polygons])

    const [color, setColor] = useState("#aabbcc")

    const [algorithm, setAlgorithm] = useState<"even-odd" | "non-zero-winding">("even-odd")
    const defaultOption = "even-odd"
    const options = ["non-zero-winding"]

    return (
        <ModalWindow isVisible={isVisible} setIsVisible={setIsVisible}>
            <MenuStyled>
                
                <FillMenu>
                    {/* Закрасить */}
                    <Button onClick={() => {
                        if (polygonId) {
                            const polygon = polygons.filter(polygon => polygon.id === polygonId)[0]
                            fillPolygon(polygon, color, algorithm)
                        }
                        setIsVisible(false)
                    }}>
                        Закрасить
                    </Button>
                    <Select title='Алгоритм' defaultOption={defaultOption} options={options} value={algorithm} setValue={setAlgorithm}/>
                    <HexColorPicker className='color-picker' color={color} onChange={setColor} />
                </FillMenu>


                <DeleteMenu>
                    {/* Удалить */}
                    <Button onClick={() => {
                        const polygon = polygons.filter(polygon => polygon.id === polygonId)[0]
                        const {left, top, right, bottom} = getPolygonBorders(polygon)
                        const width = right - left
                        const height = bottom - top
                        clearCanvas(left, top, width, height)
                        setPolygons(polygons.filter(polygon => polygon.id !== polygonId))
                        setPixels(pixels.filter(pixel => {
                            return (pixel.x < left || pixel.x > right) && (pixel.y < top || pixel.y > bottom)
                        }))
                        setIsVisible(false)
                    }}>
                        Удалить
                    </Button>
                </DeleteMenu>

                <TypeMenu>
                    {/* Тип */}
                    <Button onClick={() => {
                        const polygon = polygons.filter(polygon => polygon.id === polygonId)[0]
                        const {isConvex, isSimple} = getPolygonType(polygon)
                        setIsVisible(false)
                        alert(`${isConvex ? "Выпуклый" : "Невыпуклый"}\n${isSimple ? "Простой" : "Сложный"}`)
                    }}>
                        Тип
                    </Button>
                </TypeMenu>
            </MenuStyled>
        </ModalWindow>
    )
}

interface ICurveMenu {
    isVisible: boolean,
    setIsVisible: (visible: boolean) => void,
    curveId: number,
    curves: ICurve[],
    setCurves: (curves: ICurve[]) => void,
    clearCanvas: (left: number, top: number, width: number, height: number) => void,
    pixels: IPixel[],
    setPixels: (val: IPixel[]) => void,
}

const CurveMenu: FC<ICurveMenu> = ({isVisible, setIsVisible, curveId, curves, setCurves, clearCanvas, pixels, setPixels}) => {
    return (
    <ModalWindow isVisible={isVisible} setIsVisible={setIsVisible}>

        <MenuStyled>

            <DeleteMenu style={{margin: "0 auto"}}>
                {/* Удалить */}
                <Button onClick={() => {
                    const curve = curves.filter(curve => curve.id === curveId)[0]
                    const {left, top, right, bottom} = getCurveBorders(curve)
                    const width = right - left
                    const height = bottom - top

                    clearCanvas(left, top, width, height)
                    setCurves(curves.filter(curve => curve.id !== curveId))
                    setPixels(pixels.filter(pixel => {
                        return (pixel.x < left || pixel.x > right) && (pixel.y < top || pixel.y > bottom)
                    }))
                    setIsVisible(false)
                }}>
                    Удалить
                </Button>
            </DeleteMenu>

        </MenuStyled>

    </ModalWindow>)
}



interface IDrawMenu {
    isVisible: boolean,
    setIsVisible: (visible: boolean) => void
    setEditMode: (mode: TEditMode) => void,
    setIsEditing: (isEditing: boolean) => void
}


const DrawMenu: FC<IDrawMenu> = ({isVisible, setIsVisible, setEditMode, setIsEditing}) => {
    return (
        <ModalWindow isVisible={isVisible} setIsVisible={setIsVisible}>
            <MenuStyled style={{alignItems: "center"}}>

                <Button onClick={() => {
                    setEditMode("line")
                    setIsEditing(true)
                    setIsVisible(false)
                }}>
                    Прямая
                </Button>

                <Button onClick={() => {
                    setEditMode("polygon")
                    setIsEditing(true)
                    setIsVisible(false)
                }}>
                    Полигон
                </Button>

                <Button onClick={() => {
                    setEditMode("curve")
                    setIsEditing(true)
                    setIsVisible(false)
                }}>
                    Кривая
                </Button>

            </MenuStyled>
        </ModalWindow>
    )
}

const Desk = () => {

    const [pixels, setPixels] = useState<IPixel[]>([])
    const [lines, setLines] = useState<ILine[]>([])
    const [polygons, setPolygons] = useState<IPolygon[]>([])
    const [curves, setCurves] = useState<ICurve[]>([])

    const [lineMenuIsVisible, setLineMenuIsVisible] = useState(false)
    const [lineId, setLineId] = useState(0)
    const [isClipping, setIsClipping] = useState(false)

    const [polygonMenuIsVisible, setPolygonMenuIsVisible] = useState(false)
    const [polygonId, setPolygonId] = useState(0)

    const [curveMenuIsVisible, setCurveMenuIsVisible] = useState(false)
    const [curveId, setCurveId] = useState(0)

    const [drawMenuIsVisible, setDrawMenuIsVisible] = useState(false)

    const [editMode, setEditMode] = useState<TEditMode>()
    const [isEditing, setIsEditing] = useState(false)
    const [pixelsToConnect, setPixelsToConnect] = useState<IPixel[]>([])

    const clearCanvas = useCallback((left=0, top=0, width?: number, height?: number) => {
        const canvas = document.querySelector('#canvas');
        //@ts-ignore
        const context = canvas.getContext('2d');
        if (!width) {
            //@ts-ignore
            width = canvas?.width
        }
        if (!height) {
            //@ts-ignore
            height = canvas?.height
        }
        //@ts-ignore
        context.clearRect(left, top, width,height);
    }, [])

    const drawPixel = useCallback((x: number, y: number, color: string, w=1, h=1) => {
        const canvas = document.querySelector('#canvas');
        
        const height = window.innerHeight
        //@ts-ignore
        const context = canvas.getContext('2d');
        context.fillStyle = color || '#000';
    
        context.fillRect(x, height - y, w, h);
    }, [])

    const drawLine = useCallback(() => {
        if (pixelsToConnect.length == 2) {
            const line = DrawLine(pixelsToConnect[0], pixelsToConnect[1], "white")
            setLines([...lines, line])
        } else {
            alert("number of points must be 2")
            setLines([...lines])
        }
        setPixelsToConnect([])
    }, [pixelsToConnect])

    const clipLine = useCallback(() => {
        const polygon = DrawPolygon(pixelsToConnect, "white")
        const line = lines.filter(line => line.id === lineId)[0]

        const newLine = CyrusBeckClipLine(line, polygon)
        if (!newLine) {
            setLines([...lines])
            setIsClipping(false)
            setPixelsToConnect([])
            return;
        }

        setLines([...lines.filter(line => line.id !== lineId), newLine])
        setIsClipping(false)
        setPixelsToConnect([])
    }, [pixelsToConnect])

    const drawPolygon = useCallback(() => {
        if (pixelsToConnect.length <= 2) {
            alert("number of points must be > 2")
            setPolygons([...polygons])
            setPixelsToConnect([])
            return;
        }
        if (pixelsToConnect.length) {
            const polygon = DrawPolygon(pixelsToConnect, "white")
            setPolygons([...polygons, polygon])
        }
        setPixelsToConnect([])
    }, [pixelsToConnect])

    const drawCurve = useCallback(() => {
        if (pixelsToConnect.length) {
            const curve = DrawBezierCurve(pixelsToConnect, "white")
            if (!curve) {
                setCurves([...curves])
                setPixelsToConnect([])
                return;
            }
            setCurves([...curves, curve])
        }
        setPixelsToConnect([])
    }, [pixelsToConnect])

    useEffect(() => {
        const canvas = document.querySelector('#canvas');
        canvas?.setAttribute('height', `${window.innerHeight}`)
        canvas?.setAttribute('width', `${window.innerWidth}`)
 
        checkDrawLine()

    }, [])

    useEffect(() => {
        clearCanvas()
        pixels.forEach(pixel => {
            drawPixel(pixel.x, pixel.y, pixel.color)
        })

        lines.forEach(line => {
            line.vertexes.forEach(pixel => {
                drawPixel(pixel.x, pixel.y, pixel.color)
            })
        })

        polygons.forEach(polygon => {
            polygon.lines.forEach(line => {
                line.vertexes.forEach(vertex => drawPixel(vertex.x, vertex.y, vertex.color))
            })
        })

        curves.forEach(curve => {
            curve.lines.forEach(line => {
                line.vertexes.forEach(vertex => drawPixel(vertex.x, vertex.y, vertex.color))
            })
        })

    }, [pixels, lines, polygons, curves])

    useEffect(() => {
        if (pixelsToConnect.length) {
            const polygon = DrawPolygon(pixelsToConnect, "white")
            setPolygons([...polygons, polygon])
        }
        setPixelsToConnect([])
    }, [editMode])

    return (
        <DeskStyled $isEditing={isEditing} onClick={(e) => {
            if (editMode) {
                const h = window.innerHeight
                const x = e.clientX
                const y = h - e.clientY
                const color = "white"
                drawPixel(x, y, "red", 5, 5)
                setPixelsToConnect([...pixelsToConnect, {x, y, color}])
            }
        }}>
            <canvas id={"canvas"}/>
            <EditIcon 
                className="edit" 
                onClick={(e) => {
                    e.stopPropagation()
                    if (!isEditing) {
                        setDrawMenuIsVisible(true)
                    } else {
                        if (editMode === "line") {
                            drawLine()
                        }

                        if (editMode === "polygon") {
                            if (!isClipping) {
                                drawPolygon()
                            } else {
                               clipLine()
                            }
                        
                        }

                        if (editMode === "curve") {
                            drawCurve()
                        }

                        setEditMode(undefined)
                        setIsEditing(false)
                    }
                    
                }}
            />
            <>

                {lines.map(line => {
                    const {left, top, right, bottom} = getPolygonBorders({lines: [line]} as IPolygon)
                    const width = right - left
                    const height = top - bottom
                    return <Box key={line.id} $isEditing={isEditing} style={{left, bottom, width, height}} onClick={() => {
                        if (!editMode) {
                            setLineId(line.id)
                            setLineMenuIsVisible(true)
                        }
                    }}/>
                
                })}

                {polygons.map(polygon => {
                    const {left, top, right, bottom} = getPolygonBorders(polygon)
                    const width = right - left
                    const height = top - bottom
                    return <Box key={polygon.id} $isEditing={isEditing} style={{left, bottom, width, height}} onClick={() => {
                        if (!editMode) {
                            setPolygonId(polygon.id)
                            setPolygonMenuIsVisible(true)
                        }
                    }}/>
                })}

                {curves.map(curve => {
                    const {left, top, right, bottom} = getCurveBorders(curve)
                    const width = right - left
                    const height = top - bottom
                    return <Box key={curve.id} $isEditing={isEditing} style={{left, bottom, width, height}} onClick={() => {
                        if (!editMode) {
                            setCurveId(curve.id)
                            setCurveMenuIsVisible(true)
                        }
                    }}/>
                })}

            </>

            <DrawMenu isVisible={drawMenuIsVisible} setIsVisible={setDrawMenuIsVisible} setIsEditing={setIsEditing} setEditMode={setEditMode} />
            <LineMenu 
                pixels={pixels}
                setPixels={setPixels} 
                lines={lines} 
                setLines={setLines}
                isVisible={lineMenuIsVisible} 
                setIsVisible={setLineMenuIsVisible} 
                lineId={lineId} clearCanvas={clearCanvas}
                setEditMode={setEditMode}
                setIsClipping={setIsClipping}
                setIsEditing={setIsEditing}
            />
            <PolygonMenu pixels={pixels} setPixels={setPixels} polygons={polygons} setPolygons={setPolygons} isVisible={polygonMenuIsVisible} setIsVisible={setPolygonMenuIsVisible} polygonId={polygonId} clearCanvas={clearCanvas}/>
            <CurveMenu pixels={pixels} setPixels={setPixels} curves={curves} setCurves={setCurves} isVisible={curveMenuIsVisible} setIsVisible={setCurveMenuIsVisible} curveId={curveId} clearCanvas={clearCanvas}/>

        </DeskStyled>
    );
};

function checkDrawLine() {
    const pixels1_1 = DrawLine({x: 0, y: 0}, {x: 8, y: 3}).vertexes
    const pixels1_2 = DrawLine({x: 8, y: 3}, {x: 0, y: 0}).vertexes.reverse()

    const pixels2_1 = DrawLine({x: 0, y: 0}, {x: -8, y: -3}).vertexes
    const pixels2_2 = DrawLine({x: -8, y: -3}, {x: 0, y: 0}).vertexes.reverse()

    const pixels3_1 = DrawLine({x: 0, y: 0}, {x: -3, y: -8}).vertexes
    const pixels3_2 = DrawLine({x: -3, y: -8}, {x: 0, y: 0}).vertexes.reverse()

    console.log("0;0 and 8;3 in different orders")
    console.log(pixels1_1, pixels1_2)
    console.log("----------")

    console.log("0;0 and -8;-3 in different orders")
    console.log(pixels2_1, pixels2_2)
    console.log("----------")

    console.log("0;0 and -3;-8 in different orders")
    console.log(pixels3_1, pixels3_2)
    console.log("----------")
}

export default Desk;