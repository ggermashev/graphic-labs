import React, {FC} from 'react';
import {ModalWindowStyled, Form} from "./ModalWindow.styled";
import {createPortal} from "react-dom";

interface IModalWindow {
    children: React.ReactNode,
    isVisible: boolean,
    setIsVisible: (isVisible: boolean) => void,
    height?: string,
    width?: string,
}

const ModalWindow: FC<IModalWindow> = ({
                                           children,
                                           isVisible,
                                           setIsVisible,
                                           height,
                                           width
                                       }) => {
    return (
        createPortal(
            <ModalWindowStyled
                onClick={() => {
                    setIsVisible(false)
                }}
                $display={!isVisible ? 'none' : undefined}
            >
                <Form
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                    $height={height}
                    $width={width}
                >
                    {children}
                </Form>
            </ModalWindowStyled>, document.body)
    );
};

export default ModalWindow;