import styled from "styled-components";

const SelectStyled = styled.div`
  user-select: none;
  position: relative;
  color: #01001e;
  width: 250px;
`

const Field = styled.div`
  height: 50px;
  min-width: 200px;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 1em 1em 0 0;
  border-bottom: 1px solid black;

  &:hover {
    cursor: pointer;
  }

  p {
    margin-left: 10px;
    font-size: 1.2em;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  img {
    height: 30px;
    width: 30px;
    margin-right: 10px;
  }
`

const Options = styled.div`
  position: absolute;
  max-height: 150px;
  height: 0;
  width: 100%;
  display: none;
  opacity: 0;
  overflow-y: auto;
  border-radius: 0 0 1em 1em;
  z-index: 3;
`

const OptionStyled = styled.div`
  height: 50px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    font-size: 1.2em;
  }

  &:hover {
    background-color: #c1c5fc;
    cursor: pointer;
  }
`

export {SelectStyled, OptionStyled, Options, Field}