//general
import {FC} from "react"
import { ICurveMenu } from "../types"

//css
import { MenuStyled } from "../styles.styled"
import { DeleteMenu } from "./CurveMenu.styled"

//components
import ModalWindow from "../../ModalWindow/ModalWindow"
import Button from "../../../ui/Button/Button"

//functions
import { getCurveBorders } from "../../../algorithms/utils"


export const CurveMenu: FC<ICurveMenu> = ({isVisible, setIsVisible, curveId, curves, setCurves, clearCanvas, pixels, setPixels}) => {
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