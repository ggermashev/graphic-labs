//general
import {FC} from "react"
import {ILineMenu} from "../types"
import { IPolygon } from "../../../interfaces/IPolygon";

//css
import { MenuStyled } from "../styles.styled"
import { DeleteMenu } from "./LineMenu.styled";

//components
import ModalWindow from "../../ModalWindow/ModalWindow";
import Button from "../../../ui/Button/Button";

//functions
import { getPolygonBorders } from "../../../algorithms/utils";


export const LineMenu: FC<ILineMenu> = ({pixels, setPixels, lines, setLines, isVisible, setIsVisible, lineId, clearCanvas, setIsClipping, setIsEditing, setEditMode}) => {

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