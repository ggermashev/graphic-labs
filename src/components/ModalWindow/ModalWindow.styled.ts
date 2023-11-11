import styled, {css} from "styled-components";

interface IForm {
    $height?: string,
    $width?: string
}

interface IModalWindow {
    $display?: string
}

const ModalWindowStyled = styled.div<IModalWindow>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255,255,255,0.7);
  z-index: 50;
  
  ${props => props.$display && css`
    display: ${props.$display};
  `}
`

const Form = styled.div<IForm>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  background-color: white;
  max-height: 100vh;
  max-width: 90%;
  height: auto;
  width: 600px;
  padding: 1em;
  position: relative;
  border-radius: 1em;
  
  ${props => props.$height && css`
    height: ${props.$height};
  `}

  ${props => props.$width && css`
    height: ${props.$width};
  `}
`

export {ModalWindowStyled, Form}