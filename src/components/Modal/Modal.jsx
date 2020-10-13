import React from 'react';
import './Modal.scss';

const Modal = (props) => {
    return (
        <div id="modalLink" className="modal">
            <div className="modal__content">
                <span onClick={props.closeModal} className="modal__close">&times;</span>

                <label htmlFor="nameLink">Enter the link text</label>
                <input type="text" id="nameLink" />

                <label htmlFor="link">Enter the link</label>
                <input type="text" id="link" />

                <button onClick={props.createLink}>Create</button>
            </div>
        </div>
    )
}

export default Modal;
