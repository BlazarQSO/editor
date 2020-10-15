import React from 'react';

const SaveBlock = (props) => {
    return (
        <React.Fragment>
            <div class="open">
                <input type="file" id="file" className="open__input" />
                <label htmlFor="file"><span>Choose a file…</span></label>
                <button onClick={props.readFile}>Open</button>
            </div>
            <button onClick={props.saveText}>Save</button>
            <button onClick={props.savePDF}>PDF</button>
        </React.Fragment>
    )
}

export default SaveBlock;
