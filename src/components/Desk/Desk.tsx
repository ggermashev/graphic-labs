import EditIcon from '@mui/icons-material/Edit';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {DeskStyled, Polygon, MenuStyled, FillMenu, DeleteMenu, TypeMenu} from "./Desk.styled";
import {IPixel} from "../../interfaces/IPixel";
import DrawPolygon from "../../algorithms/DrawPolygon";
import {ILine} from "../../interfaces/ILine";
import {IPolygon} from "../../interfaces/IPolygon";
import {fillPolygonColor} from "../../algorithms/FillPolygon";
import {getPolygonBorders} from "../../algorithms/utils";
import ModalWindow from "../ModalWindow/ModalWindow";
import Button from "../../ui/Button/Button";
import {getPolygonType} from "../../algorithms/GetPolygonType";
import { HexColorPicker } from "react-colorful";
import Select from '../../ui/Select/Select';
import Pixel from '../Pixel/Pixel';

interface IMenu {
    pixels: IPixel[],
    setPixels: (val: IPixel[]) => void,
    polygons: IPolygon[],
    setPolygons: (val: IPolygon[]) => void,
    modalIsVisible: boolean,
    setModalIsVisible: (val: boolean) => void,
    polygonId: number,
    clearCanvas: (left: number, top: number, width: number, height: number) => void
}

const Menu: FC<IMenu> =({pixels, setPixels, polygons, setPolygons, modalIsVisible, setModalIsVisible, polygonId, clearCanvas}) => {

    const fillPolygon = useCallback((polygon: IPolygon, color: string, algorithm: "even-odd" | "non-zero-winding") => {
        const coloredPixels = (fillPolygonColor(polygon, color, algorithm) as IPixel[])
        setPixels(coloredPixels)
    }, [pixels, polygons])

    const [color, setColor] = useState("#aabbcc")

    const [algorithm, setAlgorithm] = useState<"even-odd" | "non-zero-winding">("even-odd")
    const defaultOption = "even-odd"
    const options = ["non-zero-winding"]

    return (
        <ModalWindow isVisible={modalIsVisible} setIsVisible={setModalIsVisible}>
            <MenuStyled>
                
                <FillMenu>
                    {/* Закрасить */}
                    <Button onClick={() => {
                        if (polygonId) {
                            const polygon = polygons.filter(polygon => polygon.id === polygonId)[0]
                            fillPolygon(polygon, color, algorithm)
                        }
                        setModalIsVisible(false)
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
                        setModalIsVisible(false)
                    }}>
                        Удалить
                    </Button>
                </DeleteMenu>

                <TypeMenu>
                    {/* Тип */}
                    <Button onClick={() => {
                        const polygon = polygons.filter(polygon => polygon.id === polygonId)[0]
                        const {isConvex, isSimple} = getPolygonType(polygon)
                        setModalIsVisible(false)
                        alert(`${isConvex ? "Выпуклый" : "Невыпуклый"}\n${isSimple ? "Простой" : "Сложный"}`)
                    }}>
                        Тип
                    </Button>
                </TypeMenu>
            </MenuStyled>
        </ModalWindow>
    )
}

const Desk = () => {

    const [pixels, setPixels] = useState<IPixel[]>([])
    const [lines, setLines] = useState<ILine[]>([])
    const [polygons, setPolygons] = useState<IPolygon[]>([])

    const [modalIsVisible, setModalIsVisible] = useState(false)
    const [polygonId, setPolygonId] = useState(0)

    const [editMode, setEditMode] = useState(false)
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
                drawPixel(pixel.x, pixel.y, pixel.color)
            })
        })
        polygons.forEach(polygon => {
            polygon.lines.forEach(line => {
                line.vertexes.forEach(vertex => drawPixel(vertex.x, vertex.y, vertex.color))
            })
        })
    }, [pixels, lines, polygons])

    useEffect(() => {
        if (pixelsToConnect.length) {
            const polygon = DrawPolygon(pixelsToConnect, "white")
            setPolygons([...polygons, polygon])
        }
        setPixelsToConnect([])
    }, [editMode])

    return (
        <DeskStyled $editMode={editMode} onClick={(e) => {
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
                    setEditMode(!editMode)
                }}
            />
            <>
                {polygons.map(polygon => {
                    const {left, top, right, bottom} = getPolygonBorders(polygon)
                    const width = right - left
                    const height = top - bottom
                    return <Polygon $editMode={editMode} style={{left, bottom, width, height}} onClick={() => {
                        if (!editMode) {
                            setPolygonId(polygon.id)
                            setModalIsVisible(true)
                        }
                    }}/>
                })}
            </>

            <Menu pixels={pixels} setPixels={setPixels} polygons={polygons} setPolygons={setPolygons} modalIsVisible={modalIsVisible} setModalIsVisible={setModalIsVisible} polygonId={polygonId} clearCanvas={clearCanvas}/>

        </DeskStyled>
    );
};

export default Desk;