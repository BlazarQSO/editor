import React from 'react';
import './Main.scss';
import ButtonStyle from '../Buttons/ButtonStyle';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.position = 0;
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
        this.getCursorPosition = this.getCursorPosition.bind(this);
        this.setCursorPosition = this.setCursorPosition.bind(this);
        this.findOutCurElement = this.findOutCurElement.bind(this);
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

    click(e) {
        this.editor = document.querySelector('.editor');
        // this.target = e.target;
        // if (this.target.tagName === 'SPAN') {
        //     this.setState({ classes: [...this.target.classList] });
        // }
    }

    getCursorPosition(parent) {
        let selection = document.getSelection()
        let range = new Range
        range.setStart(parent, 0)
        range.setEnd(selection.anchorNode, selection.anchorOffset)
        return range.toString().length
    }

    setCursorPosition(parent, position) {
        let child = parent.firstChild
        while (position > 0) {
            let length = child.textContent.length
            if (position > length) {
                position -= length
                child = child.nextSibling
            }
            else {
                if (child.nodeType == 3) return document.getSelection().collapse(child, position)
                child = child.firstChild
            }
        }
    }

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
        this.editor.focus();
        this.setCursorPosition(this.editor, this.position);
        this.setState({ buttons });
    }

    keyDow(e) {
        const position = this.getCaretPosition();
        const selected = document.getSelection().toString().length;
        const classes = this.state.classes.sort().join(' ');

        // const elem = document.querySelector('.editor');
        const pos2 = this.getCursorPosition(this.editor);
        console.log(position);
        console.log(pos2);

        if (selected === 0) {
            const isNewTextStyle = [...this.target.classList].sort().join() !== classes;
            const newSpan = `<span class="${classes}">${e.key}</span>`;
            if (this.target.tagName !== 'SPAN') {
                // const span = document.createElement('span');
                // span.className = classes;
                // span.textContent = e.key;
                this.target.innerHTML = newSpan;
                // span.focus();
                e.preventDefault();
            } else if (isNewTextStyle) {
                let content = this.target.innerHTML;
                this.target.innerHTML = content.slice(0, position) + newSpan + content.slice(position);
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
                    onClick={this.click.bind(this)}
                    onKeyDown={this.keyDow.bind(this)}
                    onSelect={this.findOutCurElement.bind(this)}
                >
                    <div><span className="bold">123456789</span></div>
                    <div><span className="italic">italic</span></div>
                </div>
            </main>
        )
    }
}

export default Main;
