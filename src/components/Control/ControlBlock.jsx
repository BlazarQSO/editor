import React from 'react';
import ButtonStyle from '../Buttons/ButtonStyle';

const ControlBlock = (props) => {
    return (
        <React.Fragment>
            <ButtonStyle
                clickBtn={props.clickBtn}
                className={'link'}
                value={'link'}
            />
            <input type="color" id="idColor" onChange={props.getColor} className="color"></input>
            <select onChange={props.changeFontFamily} id="fontFamily" className="select">
                <option value="Roboto" selected>Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
            </select>
        </React.Fragment>
    )
}

export default ControlBlock;
