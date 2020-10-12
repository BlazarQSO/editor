import React from 'react';
import './Main.scss';

const Main = () => {
    return (
        <main className="main">
            <section className="control">
                <button>B</button>
                <button>I</button>
                <button style={{textDecoration: 'underline'}}>U</button>
                <button>Sup</button>
                <button>Sub</button>
                <button>link</button>
                <button>Open</button>
                <button>Save</button>
            </section>
            <div className="editor"
                contentEditable="true">
                ...
            </div>
        </main>
    )
}

export default Main;
