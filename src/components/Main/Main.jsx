import React from 'react';
import './Main.scss';
import ButtonStyle from '../Buttons/ButtonStyle';

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            buttons: [
                { active: false, className: 'bold', value: 'B', },
                { active: false, className: 'italic', value: 'I', },
                { active: false, className: 'underline', value: 'U', },
                { active: false, className: 'super', value: 'sup' },
                { active: false, className: 'sub', value: 'sub' },
                { active: false, className: 'link', value: 'link' },
                { active: false, className: 'open', value: 'Open' },
                { active: false, className: 'save', value: 'Save' },
            ],
            classes: ['bold']
        }
        this.target = '';
        this.keyDow = this.keyDow.bind(this);
    }

    findOutCurElement() {
        const { focusNode } = document.getSelection();
        if (focusNode && focusNode.data && focusNode.data.length > 0) {
            this.target = focusNode.parentElement;
        }

        // const selected = document.getSelection().toString().length;
        if (this.target.tagName === 'SPAN') {
            this.setState({ classes: [...this.target.classList] });
        }
    }

    // click(e) {
    //     this.target = e.target;
    //     if (this.target.tagName === 'SPAN') {
    //         this.setState({ classes: [...this.target.classList] });
    //     }
    // }

    getCaretPosition() {
        let caretOffset = 0;
        const range = window.getSelection().getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(this.target);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
        return caretOffset;
    }

    clickBtn(value) {
        let { buttons } = this.state;
        buttons = buttons.map((btn) => {
            if (btn.value === value) {
                btn.active = !btn.active;
            }
            return btn;
        });
        this.setState({ buttons });
    }

    keyDow(e) {
        const position = this.getCaretPosition();
        const selected = document.getSelection().toString().length;
        const classes = this.state.classes.join(' ');

        if (selected === 0) {
            if (this.target.tagName !== 'SPAN') {
                // const span = document.createElement('span');
                // span.className = classes;
                // span.textContent = e.key;
                this.target.innerHTML = `<span class="${classes}">${e.key}</span>`
                // span.focus();
                e.preventDefault();
            }
        }
    }

    render() {
        return (
            <main className="main">
                <section className="control">
                    {this.state.buttons.map((button, index) => {
                        return <ButtonStyle
                            key={index}
                            clickBtn={this.clickBtn.bind(this)}
                            active={button.active}
                            className={button.className}
                            value={button.value}
                        />
                    })}
                </section>
                <div className="editor"
                    aria-label="rdw-editor"
                    contentEditable="true"
                    role="textbox"
                    // onClick={this.click.bind(this)}
                    onKeyDown={this.keyDow.bind(this)}
                    onSelect={this.findOutCurElement.bind(this)}
                >
                    <div><span className="">...</span></div>
                    {/* <div><span className="italic">italic</span></div> */}
                </div>
            </main>
        )
    }
}

export default Main;
