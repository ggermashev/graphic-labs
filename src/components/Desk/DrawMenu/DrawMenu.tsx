//general
import {FC} from "react"
import { IDrawMenu } from "../types"

//css
import { MenuStyled } from "../styles.styled"

//components
import ModalWindow from "../../ModalWindow/ModalWindow"
import Button from "../../../ui/Button/Button"

//functions

export const DrawMenu: FC<IDrawMenu> = ({isVisible, setIsVisible, setEditMode, setIsEditing}) => {
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
                    setEditMode("bezier_curve")
                    setIsEditing(true)
                    setIsVisible(false)
                }}>
                    Кривая Безье
                </Button>

                <Button onClick={() => {
                    setEditMode("hermite_curve")
                    setIsEditing(true)
                    setIsVisible(false)
                }}>
                    Составная кривая Эрмита
                </Button>

                <Button onClick={() => {
                    setEditMode("cube")
                    setIsEditing(true)
                    setIsVisible(false)
                }}>
                    Куб
                </Button>

            </MenuStyled>
        </ModalWindow>
    )
}