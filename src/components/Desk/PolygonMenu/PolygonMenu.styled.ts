import {css, styled} from "styled-components"

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

const TypeMenu = styled.div``

const BoundingMenu = styled.div``

const DeleteMenu = styled.div``

export { FillMenu, TypeMenu, BoundingMenu, DeleteMenu }