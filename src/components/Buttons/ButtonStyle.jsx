import React from 'react';

const ButtonStyle = (props) => {
    const classes = (props.active) ? `${props.className} active-btn` : props.className;
    return (
        (props.className === 'super' || props.className === 'sub')
            ?
            <button className={classes} onClick={props.clickBtn.bind(null, props.value)}>
                <span>X</span>
                <span className={props.className}>{props.value}</span>
            </button>
            :
            <button className={classes} onClick={props.clickBtn.bind(null, props.value)}>{props.value}</button>
    )
}

export default ButtonStyle;
