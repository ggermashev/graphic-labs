//general
import {FC, useCallback, useState} from "react"
import { IPolygonMenu } from "../types"
import { IPolygon } from "../../../interfaces/IPolygon"
import { IPixel } from "../../../interfaces/IPixel"

//css
import { MenuStyled } from "../styles.styled"
import { FillMenu, TypeMenu, BoundingMenu, DeleteMenu } from "./PolygonMenu.styled"

//components
import ModalWindow from "../../ModalWindow/ModalWindow"
import Button from "../../../ui/Button/Button"
import Select from "../../../ui/Select/Select"
import { HexColorPicker } from "react-colorful";

//functions
import { fillPolygonColor } from "../../../algorithms/FillPolygon"
import getPolygonType from "../../../algorithms/GetPolygonType"
import getConvexBounding from "../../../algorithms/GetConvexBounding"
import { getPolygonBorders } from "../../../algorithms/utils"



export const PolygonMenu: FC<IPolygonMenu> =({pixels, setPixels, polygons, setPolygons, isVisible, setIsVisible, polygonId, clearCanvas}) => {

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

                <TypeMenu>
                    <Button onClick={() => {
                        const polygon = polygons.filter(polygon => polygon.id === polygonId)[0]
                        const {isConvex, isSimple} = getPolygonType(polygon, true)
                        setIsVisible(false)
                        alert(`${isConvex ? "Выпуклый" : "Невыпуклый"}\n${isSimple ? "Простой" : "Сложный"}`)
                    }}>
                        Тип
                    </Button>
                </TypeMenu>

                <BoundingMenu>
                    <Button onClick={() => {
                        const polygon = polygons.filter(polygon => polygon.id === polygonId)[0]

                        const boundingPolygon = getConvexBounding(polygon)
                        if (boundingPolygon) {
                            setPolygons([...polygons, boundingPolygon])
                        }
                        
                        setIsVisible(false)
                    }}>
                        Оболочка
                    </Button>
                </BoundingMenu>

                <DeleteMenu>
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
            </MenuStyled>
        </ModalWindow>
    )
}