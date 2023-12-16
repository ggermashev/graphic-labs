//general
import { useCallback, useEffect, useState} from 'react';
import {IPixel} from "../../interfaces/IPixel";
import {ILine} from "../../interfaces/ILine";
import {IPolygon} from "../../interfaces/IPolygon";
import { ICurve } from '../../interfaces/ICurve';
import IVertex from '../../interfaces/IVertex';
import { TEditMode } from './types';

//css
import {DeskStyled, Box} from "./Desk.styled";

//components
import EditIcon from '@mui/icons-material/Edit';
import { LineMenu } from './LineMenu/LineMenu';
import { PolygonMenu } from './PolygonMenu/PolygonMenu';
import { CurveMenu } from './CurveMenu/CurveMenu';
import { DrawMenu } from './DrawMenu/DrawMenu';

//functions
import DrawPolygon from "../../algorithms/DrawPolygon";
import {getPolygonBorders, getCurveBorders} from "../../algorithms/utils";
import DrawLine from '../../algorithms/DrawLine';
import  DrawBezierCurve  from '../../algorithms/DrawBezierCurve';
import  CyrusBeckClipLine from '../../algorithms/CyrusBeckClipLine';
import drawHermiteCompoundCurve, { IVector } from '../../algorithms/DrawHermiteCompoundCurve';
import { Vertex3 } from '../../interfaces/IVertex3';
import { Cube } from '../../interfaces/ICube';
import { CubeMenu } from './CubeMenu/CubeMenu';


const Desk = () => {

    const [pixels, setPixels] = useState<IPixel[]>([])
    const [lines, setLines] = useState<ILine[]>([])
    const [polygons, setPolygons] = useState<IPolygon[]>([])
    const [curves, setCurves] = useState<ICurve[]>([])
    const [cubes, setCubes] = useState<Cube[]>([])

    const [lineMenuIsVisible, setLineMenuIsVisible] = useState(false)
    const [lineId, setLineId] = useState(0)
    const [isClipping, setIsClipping] = useState(false)

    const [polygonMenuIsVisible, setPolygonMenuIsVisible] = useState(false)
    const [polygonId, setPolygonId] = useState(0)

    const [curveMenuIsVisible, setCurveMenuIsVisible] = useState(false)
    const [curveId, setCurveId] = useState(0)

    const [cubeMenuIsVisible, setCubeMenuIsVisible] = useState(false)
    const [cubeId, setCubeId] = useState(0)
    const [rotateIntervals, setRotateIntervals] = useState<Record<string, NodeJS.Timer | undefined>>({})
    const [hideFacesCubeIds, setHideFacesCubeIds] = useState<string[]>([])
    const [showProjectionCubeIds, setShowProjectionCubeIds] = useState<string[]>([])

    const [drawMenuIsVisible, setDrawMenuIsVisible] = useState(false)

    const [editMode, setEditMode] = useState<TEditMode>()
    const [isEditing, setIsEditing] = useState(false)
    const [pixelsToConnect, setPixelsToConnect] = useState<IPixel[]>([])
    const [vectorsToConnect, setVectorsToConnect] = useState<IVector[]>([])
    const [vectorToConnect, setVectorToConnect] = useState<IVector>()
    const [vectorId, setVectorId] = useState(-1)

    const [mouseIsDown, setMouseIsDown] = useState(false)

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
        const width = window.innerWidth
        //@ts-ignore
        const context = canvas.getContext('2d');
        context.fillStyle = color || '#000';
    
        context.fillRect(Math.round(width/2) + x, Math.round(height / 2) - y, w, h);
    }, [])

    const drawLine = useCallback((color="white", id?: number, clearPixels=true) => {
        if (pixelsToConnect.length == 2) {
            const line = DrawLine(pixelsToConnect[0], pixelsToConnect[1], color, id)
            setLines([...lines.filter(line => line.id !== vectorId), line])
        } else {
            alert("number of points must be 2")
            setLines([...lines])
        }

        if (clearPixels) {
            setPixelsToConnect([])
        }
        
    }, [pixelsToConnect, lines])

    const clipLine = useCallback(() => {
        const polygon = DrawPolygon(pixelsToConnect, "green")
        const line = lines.filter(line => line.id === lineId)[0]

        const newLine = CyrusBeckClipLine(line, polygon)
        if (!newLine) {
            setLines([...lines])
            setIsClipping(false)
            setPixelsToConnect([])
            return;
        }

        setLines([...lines, newLine])
        setPolygons([...polygons, polygon])
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

    const drawBezierCurve = useCallback(() => {
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

    const drawCube = useCallback(() => {
        if (pixelsToConnect.length === 1) {
            const cube = new Cube(new Vertex3({x: pixelsToConnect[0].x, y: 0, z: pixelsToConnect[0].y}), 200, 200, 200)
            setCubes([...cubes, cube])
        } else {
            alert("must be 1 left-bottom point")
            setCubes([...cubes])
            setIsEditing(false)
            setEditMode(undefined)
        }
        setPixelsToConnect([])
    }, [pixelsToConnect, cubes])

    const rotateCube = useCallback((cubeId: number) => {
        if (pixelsToConnect.length === 1) {
            const cube = cubes.filter(cube => cube.id === cubeId)[0]
            setRotateIntervals({...rotateIntervals, 
                [cubeId]: setInterval(() => {
                    cube.rotate(0.1, new Vertex3({x: pixelsToConnect[0].x, y: 100, z: pixelsToConnect[0].y}))
                    setCubes([...cubes])
                }, 1) })
                  
        } else {
            alert("must be 1 point: end of vector")
        }
        setPixelsToConnect([])
    }, [pixelsToConnect, rotateIntervals, cubes])

    useEffect(() => {
        if (isEditing) {
            const intervals: Record<string, NodeJS.Timer | undefined> = {}
            Object.entries(rotateIntervals).forEach(([cubeId, timerId]) => {
                clearInterval(timerId)
                intervals[cubeId] = undefined
            })
            setRotateIntervals(intervals)
        } else {
            const intervals: Record<string, NodeJS.Timer> = {}
            Object.keys(rotateIntervals).forEach((cubeId) => {
                if (rotateIntervals[cubeId] === undefined) {
                    const cube = cubes.filter(cube => cube.id.toString() === cubeId)[0]
                    intervals[cubeId] = setInterval(() => {
                            //@ts-ignore
                            cube.rotate(0.1, cube.rotateDirection)
                            setCubes([...cubes])
                    }, 1)
                }
            })
            setRotateIntervals({...rotateIntervals, ...intervals})
        }
        
    }, [isEditing])

    const drawHermiteCurve = useCallback(() => {
        if (vectorsToConnect) {
            const curve = drawHermiteCompoundCurve(vectorsToConnect)
            if (curve) {
                setCurves([...curves, curve])
                setLines(lines.filter(line => line.id > 0))
            }
        }
        setPixelsToConnect([])
        setVectorsToConnect([])
        setVectorId(-1)
    }, [vectorsToConnect])

    useEffect(() => {
        const canvas = document.querySelector('#canvas');
        canvas?.setAttribute('height', `${window.innerHeight}`)
        canvas?.setAttribute('width', `${window.innerWidth}`)
    }, [])

    useEffect(() => {
        
        clearCanvas()
        pixels.forEach(pixel => {
            drawPixel(pixel.x, pixel.y, pixel.color)
        })

        lines.forEach(line => {
            line.vertexes.forEach(pixel => {
                drawPixel(pixel.x, pixel.y, line.color)
            })
        })

        polygons.forEach(polygon => {
            polygon.lines.forEach(line => {
                line.vertexes.forEach(vertex => drawPixel(vertex.x, vertex.y, polygon.color))
            })
        })

        curves.forEach(curve => {
            curve.lines.forEach(line => {
                line.vertexes.forEach(vertex => drawPixel(vertex.x, vertex.y, curve.color))
            })
        })

        cubes.forEach(cube => {
            cube.getLines().forEach(line => {
                line.vertexes.forEach(vertex => drawPixel(vertex.x, vertex.y, "white"))
            })  

            if (cube.showProjection) {
                cube.getOnePointProjection(1e-3).forEach(line => {
                    line.vertexes.forEach(vertex => drawPixel(vertex.x, vertex.y, "red"))
                })  
            }
        })
        
    }, [pixels, lines, polygons, curves, cubes])

    useEffect(() => {
        if (pixelsToConnect.length) {
            const polygon = DrawPolygon(pixelsToConnect, "white")
            setPolygons([...polygons, polygon])
        }
        setPixelsToConnect([])
    }, [editMode])

    return (
        <DeskStyled 
            $isEditing={isEditing} 
            onClick={(e) => {
                if (editMode) {
                    const h = window.innerHeight
                    const x = e.clientX - Math.round(window.innerWidth / 2)
                    const y = Math.round(h / 2) - e.clientY 
                    const color = "white"
                    if (editMode !== "hermite_curve") {
                        drawPixel(x, y, "red", 5, 5)
                        setPixelsToConnect([...pixelsToConnect, {x, y, color}])
                    }
                }
            }}
            onMouseDown={(e) => {
                if (editMode === "hermite_curve") {
                    const h = window.innerHeight
                    const x = e.clientX - Math.round(window.innerWidth / 2)
                    const y = Math.round(h / 2) - e.clientY 
                    setVectorToConnect({origin: {x, y}, destination: {} as IVertex})
                    setMouseIsDown(true)
                    setPixelsToConnect([{x, y, color: "red"}])
                    setLineId(-1)
                }
            }}
            onMouseUp={(e) => {
                if (editMode === "hermite_curve") {
                    const h = window.innerHeight
                    const x = e.clientX - Math.round(window.innerWidth / 2)
                    const y = Math.round(h / 2) - e.clientY 
                    setVectorsToConnect([...vectorsToConnect, {...vectorToConnect, destination: {x,y}} as IVector])
                    drawPixel(pixelsToConnect[0].x, pixelsToConnect[0].y, "red", 5, 5)
                    setPixelsToConnect([])
                    setVectorId(vectorId-1)
                    setMouseIsDown(false)
                }
            }}
            onMouseMove={(e) => {
                if (editMode === "hermite_curve") {
                    if (mouseIsDown ) {
                        const h = window.innerHeight
                        const x = e.clientX - Math.round(window.innerWidth / 2)
                        const y = Math.round(h / 2) - e.clientY 
                        drawPixel(pixelsToConnect[0].x, pixelsToConnect[0].y, "red", 5, 5)
                        setPixelsToConnect([pixelsToConnect[0], {x, y, color:"red"}])
                        if (pixelsToConnect.length === 2) {
                            drawLine("red", vectorId, false)
                        }
                        
                    }
                }
            }}
        >
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

                        if (editMode === "bezier_curve") {
                            drawBezierCurve()
                        }

                        if (editMode === "hermite_curve") {
                            drawHermiteCurve()
                        }

                        if (editMode === "cube") {
                            drawCube()
                        }

                        if (editMode === "vector") {
                            rotateCube(cubeId)
                        }

                        setEditMode(undefined)
                        setIsEditing(false)
                    }
                    
                }}
                onMouseDown={(e) => {
                    e.stopPropagation()
                }}
                onMouseUp={(e) => {
                    e.stopPropagation()
                }}
                onMouseMove={(e) => {
                    e.stopPropagation()
                }}
            />
            <>

                {lines.map(line => {
                    let {left, top, right, bottom} = getPolygonBorders({lines: [line]} as IPolygon)
                    const width = right - left
                    const height = top - bottom
                    left += Math.round(window.innerWidth/2) 
                    bottom += Math.round(window.innerHeight/2)
                    return <Box key={line.id} $isEditing={isEditing} style={{left, bottom, width, height}} onClick={() => {
                        if (!editMode) {
                            setLineId(line.id)
                            setLineMenuIsVisible(true)
                        }
                    }}/>
                
                })}

                {polygons.map(polygon => {
                    let {left, top, right, bottom} = getPolygonBorders(polygon)
                    const width = right - left
                    const height = top - bottom
                    left += Math.round(window.innerWidth/2) 
                    bottom += Math.round(window.innerHeight/2)
                    return <Box key={polygon.id} $isEditing={isEditing} style={{left, bottom, width, height}} onClick={() => {
                        if (!editMode) {
                            setPolygonId(polygon.id)
                            setPolygonMenuIsVisible(true)
                        }
                    }}/>
                })}

                {curves.map(curve => {
                    let {left, top, right, bottom} = getCurveBorders(curve)
                    const width = right - left
                    const height = top - bottom
                    left += Math.round(window.innerWidth/2) 
                    bottom += Math.round(window.innerHeight/2)
                    return <Box key={curve.id} $isEditing={isEditing} style={{left, bottom, width, height}} onClick={() => {
                        if (!editMode) {
                            setCurveId(curve.id)
                            setCurveMenuIsVisible(true)
                        }
                    }}/>
                })}

                {cubes.map(cube => {
                   let {left, top, right, bottom} = cube.getBorders()
                   const width = right - left
                   const height = top - bottom
                   left += Math.round(window.innerWidth/2) 
                   bottom += Math.round(window.innerHeight/2)
                    return <Box key={cube.id} $isEditing={isEditing} style={{left, bottom, width, height}} onClick={() => {
                        if (!editMode) {
                            setCubeId(cube.id)
                            setCubeMenuIsVisible(true)
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
            <CubeMenu showProjectionCubeIds={showProjectionCubeIds} setShowProjectionCubeIds={setShowProjectionCubeIds} hideFacesCubeIds={hideFacesCubeIds} setHideFacesCubeIds={setHideFacesCubeIds} isVisible={cubeMenuIsVisible} setIsVisible={setCubeMenuIsVisible} setEditMode={setEditMode} setIsEditing={setIsEditing} cubeId={cubeId} cubes={cubes} setCubes={setCubes} rotateIntervals={rotateIntervals} setRotateIntervals={setRotateIntervals} clearCanvas={clearCanvas} pixels={pixels} setPixels={setPixels}/>

        </DeskStyled>
    );
};


export default Desk;