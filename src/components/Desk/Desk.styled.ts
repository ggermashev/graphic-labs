import {css, styled} from "styled-components"

interface IBox {
  $isEditing: boolean
}

interface IDesk {
  $isEditing: boolean
}

const DeskStyled = styled.div<IDesk>`
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: white;
  border: 1px solid black;
  
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => props.$isEditing && css`
      cursor: pointer;
    `}
  
  canvas {
    position: relative;
    background-color: black;
  }
  
  button {
    position: absolute;
    z-index: 5;
    left: 0;
    top: 0;
  }

  .edit {
    position: absolute;
    top: 1em;
    left: 1em;
    height: 1.5em;
    width: 1.5em;

    ${props => !props.$isEditing && css`
      color: white;
      @media(hover:hover) {
        &:hover {
          cursor: pointer;
        }
      }
    `}

    ${props => props.$isEditing && css`
      color: yellow;
      @media(hover:hover) {
        &:hover {
          cursor: pointer;
        }
      }
    `}
    
  }
  
`

const Box = styled.div<IBox>`
  position: absolute;
  opacity: 0;
  background-color: white;

  ${props => !props.$isEditing && css`
    &:hover {
      opacity: 0.1;
      cursor: pointer;
    }
  `}
`

const MenuStyled = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1em;
`

const FillMenu = styled.div`
  width: 100%;
  position: relative;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  gap: 1em;

  .color-picker {
    height: 10em;
    width: 10em;
  }
`

const DeleteMenu = styled.div``

const TypeMenu = styled.div``

const BoundingMenu = styled.div``

export {DeskStyled, Box, MenuStyled, FillMenu, DeleteMenu, TypeMenu, BoundingMenu}