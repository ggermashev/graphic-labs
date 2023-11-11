import React, {FC, useMemo} from 'react';
import gsap from "gsap"
import {SelectStyled, OptionStyled, Options, Field} from "./Select.styled";

interface ISelect {
    title: string,
    defaultOption: string,
    options: string[],
    value: string,
    setValue: (val: any) => void,
    className?: string,
}

interface IOption {
    option: string
}

const Select: FC<ISelect> = ({
                                 title,
                                 options,
                                 value,
                                 setValue,
                                 defaultOption,
                                 className
                             }) => {

    const onSelect = useMemo(() => {
        let closed = true
        const tlOptions = gsap.timeline()
        const tlArrow = gsap.timeline()
        return function () {
            if (closed) {
                tlArrow.to(`#${title}-arrow`, {
                    duration: 0.2,
                    rotate: 180
                })
                tlOptions.set(`#${title}-options`, {
                    display: 'block',
                })
                tlOptions.to(`#${title}-options`, {
                    duration: 0.2,
                    height: 'auto',
                    opacity: 1,
                })
            } else {
                tlOptions.to(`#${title}-options`, {
                    duration: 0.2,
                    height: 0,
                    opacity: 0,
                })
                tlOptions.set(`#${title}-options`, {
                    display: 'none',
                })
                tlArrow.to(`#${title}-arrow`, {
                    duration: 0.2,
                    rotate: 0
                })
            }
            closed = !closed
        }
    }, [])

    const Option: FC<IOption> = ({option}) => {

        return (
            <OptionStyled onClick={() => {
                setValue(option)
                onSelect()
            }}><p>{option}</p></OptionStyled>
        )
    }

    return (
        <SelectStyled className={className}>
            <Field onClick={onSelect}>
                <p>{title}: {value}</p>
                <img id={`${title}-arrow`} src={require('../../images/arrow-down.png')}/>
            </Field>
            <Options id={`${title}-options`}>
                <Option option={defaultOption}/>
                {options.map(opt => <Option key={opt} option={opt}/>)}
            </Options>
        </SelectStyled>
    );
};

export default Select;