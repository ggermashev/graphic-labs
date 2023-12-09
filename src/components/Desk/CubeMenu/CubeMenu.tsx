//general
import {FC} from "react"
import { ICubeMenu } from "../types"

//css
import { MenuStyled } from "../styles.styled"
import { DeleteMenu, RotateMenu, HideMenu, ShowProjectionMenu } from "./CubeMenu.styled"

//components
import ModalWindow from "../../ModalWindow/ModalWindow"
import Button from "../../../ui/Button/Button"

//functions


export const CubeMenu: FC<ICubeMenu> = ({
    isVisible,
    setIsVisible,
    setEditMode,
    setIsEditing,
    cubeId,
    cubes,
    setCubes,
    rotateIntervals,
    setRotateIntervals,
    hideFacesCubeIds,
    setHideFacesCubeIds,
    showProjectionCubeIds,
    setShowProjectionCubeIds,
    clearCanvas,
    pixels,
    setPixels
}) => {

    const cube = cubes.find(cube => cube.id === cubeId)
    if (!cube) {
        return (<></>)
    }

    return (
            <ModalWindow isVisible={isVisible} setIsVisible={setIsVisible}>
                <MenuStyled>

                    <RotateMenu style={{margin: "0 auto"}}>
                        {rotateIntervals[cubeId]
                            ?
                            <Button 
                                onClick={() => {
                                    cube.rotateDirection = undefined
                                    setCubes([...cubes])

                                    clearInterval(rotateIntervals[cubeId])
                                    delete rotateIntervals[cubeId]
                                    setRotateIntervals({...rotateIntervals})

                                    setIsVisible(false)
                                }}
                            >
                                    Остановить
                            </Button>
                            :
                            <Button 
                                onClick={() => {
                                    setIsEditing(true)
                                    setEditMode("vector")
                                    setIsVisible(false)
                                }}
                            >
                                    Вращать
                            </Button>
                        }
                    </RotateMenu>

                    <HideMenu style={{margin: "0 auto"}}>
                        {hideFacesCubeIds.includes(cube.id.toString())
                        ?
                        <Button
                            onClick={() => {
                                cube.hideFaces = false
                                setCubes([...cubes])
                                setHideFacesCubeIds(hideFacesCubeIds.filter(id => id !== cube.id.toString()))
                                setIsVisible(false)
                            }}
                        >
                            Показать все грани
                        </Button>
                        :
                        <Button
                            onClick={() => {
                                cube.hideFaces = true
                                setCubes([...cubes])
                                setHideFacesCubeIds([...hideFacesCubeIds, cube.id.toString()])
                                setIsVisible(false)
                            }}
                        >
                            Скрыть невидимые грани
                        </Button>
                        }
                    </HideMenu>

                    <ShowProjectionMenu style={{margin: "0 auto"}}>
                        {showProjectionCubeIds.includes(cube.id.toString())
                        ?
                            <Button
                                onClick={() => {
                                    cube.showProjection = false
                                    setCubes([...cubes])
                                    setShowProjectionCubeIds(showProjectionCubeIds.filter(id => id !== cube.id.toString()))
                                    setIsVisible(false)
                                }}
                            >
                                Скрыть проекцию
                            </Button>
                        :
                            <Button
                                onClick={() => {
                                    cube.showProjection = true
                                    setCubes([...cubes])
                                    setShowProjectionCubeIds([...showProjectionCubeIds, cube.id.toString()])
                                    setIsVisible(false)
                                }}
                            >
                                Показать проекцию
                            </Button>
                        }
                    </ShowProjectionMenu>
                    
                    <DeleteMenu style={{margin: "0 auto"}}>
                        <Button onClick={() => {
                            setCubes(cubes.filter(cube => cube.id !== cubeId))
                            setIsVisible(false)
                        }}>
                            Удалить
                        </Button>
                    </DeleteMenu>

                </MenuStyled>
         </ModalWindow>
    )
}