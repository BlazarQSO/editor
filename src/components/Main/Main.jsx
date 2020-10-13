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
            classes: ['']
        }
        this.target = '';
        this.keyDow = this.keyDow.bind(this);
        this.getCursorPosition = this.getCursorPosition.bind(this);
        this.setCursorPosition = this.setCursorPosition.bind(this);
        this.findOutCurElement = this.findOutCurElement.bind(this);
    }

    componentDidMount() {
        this.editor = document.querySelector('.editor');
        const firstSpan = document.getElementById('firstSpan');
        this.setCursorPosition(firstSpan, 1);
        // document.querySelector('#idColor').value = '#0000ff';
    }

    initContent() {
        this.editor.innerHTML = '<div><span className="" id="firstSpan">  </span></div>';
    }

    findOutCurElement() {
        const { focusNode } = document.getSelection();
        if (focusNode && focusNode.data && focusNode.data.length > 0) {
            this.target = focusNode.parentElement;
        }
    }

    getColor() {
        this.color = document.querySelector('#idColor').value;
        this.editor.focus();
        this.setCursorPosition(this.editor, this.position);
    }

    setColor() {
        this.color = window.getComputedStyle(this.target, null).getPropertyValue('color');

        const rgbToHex = (r, g, b) => '#' + [r, g, b]
            .map(x => x.toString(16).padStart(2, '0')).join('')

        const hex = rgbToHex(...this.color.slice(4, this.color.length - 1)
            .split(', ').map((n) => +n));

        document.querySelector('#idColor').value = hex;
    }

    selectInEditor() {
        this.findOutCurElement();
        this.position = this.getCursorPosition(this.editor);

        let { buttons, classes } = this.state;

        this.setColor();

        if (this.target.tagName === 'SPAN') {
            classes = [...this.target.classList];
            buttons = buttons.map((button) => {
                button.active = classes.includes(button.className);
                return button;
            });
            this.setState({ buttons, classes });
        }
    }

    click(e) {
        // this.editor = document.querySelector('.editor');
        // this.target = e.target;
        // let { buttons, classes } = this.state;
        // if (this.target.tagName === 'SPAN') {
        //     classes = [...this.target.classList];
        //     buttons = buttons.map((button) => {
        //         button.active = classes.includes(button.className);
        //         return button;
        //     });
        //     this.setState({ buttons, classes });
        // }
    }

    getCursorPosition(parent) {
        let selection = document.getSelection();
        let range = new Range;
        range.setStart(parent, 0);
        range.setEnd(selection.anchorNode, selection.anchorOffset);
        return range.toString().length;
    }

    setCursorPosition(parent, position) {
        let child = parent.firstChild;
        while (position > 0) {
            let length = (child && child.textContent && child.textContent.length) || 0;
            if (position > length) {
                position -= length;
                child = (child && child.nextSibling) || null;
                if (!child) return;
            } else {
                if (child.nodeType === 3) return document.getSelection().collapse(child, position);
                child = child.firstChild;
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
        let { buttons, classes } = this.state;
        buttons = buttons.map((btn) => {
            if (btn.value === value) {
                btn.active = !btn.active;
                if (btn.active) {
                    classes.push(btn.className)
                    if (btn.value === 'sup') {
                        buttons[4].active = false;
                        const find = classes.findIndex((cl) => cl === 'sub');
                        if (find !== -1) classes.splice(find, 1);
                    } else if (btn.value === 'sub') {
                        buttons[3].active = false;
                        const find = classes.findIndex((cl) => cl === 'super');
                        if (find !== -1) classes.splice(find, 1);
                    }
                } else {
                    const find = classes.findIndex((cl) => cl === btn.className);
                    if (find !== -1) classes.splice(find, 1);
                }
            }
            return btn;
        });
        this.editor.focus();
        this.setCursorPosition(this.editor, this.position);
        this.setState({ buttons, classes });
    }

    keyDow(e) {
        if (this.editor.innerHTML === '' || this.editor.innerHTML === '<br>') this.initContent();
        const position = this.getCaretPosition();
        const selected = document.getSelection().toString().length;
        const { classes } = this.state;


        if (selected === 0 && e.key.length < 2) {
            let isNewTextStyle = [...this.target.classList].sort().join() !== classes.sort().join();
            const color = window.getComputedStyle(this.target, null).getPropertyValue('color');;
            if (color !== this.color) isNewTextStyle = true;

            const newSpan = `<span class="${classes.join(' ')}">${e.key}</span>`;
            this.position = this.getCursorPosition(this.editor) + 1;
            if (this.target.tagName !== 'SPAN') {
                this.target.innerHTML = newSpan;
                this.editor.focus();
                this.setCursorPosition(this.editor, this.position);
                e.preventDefault();
            } else if (isNewTextStyle) {
                const span = document.createElement('span');
                span.className = classes.join(' ');
                span.textContent = e.key;
                const content = this.target.innerHTML;
                if (this.color) span.style.color = this.color;

                this.target.textContent = content.slice(0, position);
                const contextLastSpan = content.slice(position);
                this.target.after(span);
                if (contextLastSpan.length > 0) {
                    const lastSpan = document.createElement('span');
                    lastSpan.className = [...this.target.classList].join(' ');
                    lastSpan.textContent = contextLastSpan;
                    span.after(lastSpan);
                }

                this.target = span;
                this.editor.focus();
                this.setCursorPosition(this.editor, this.position);
                e.preventDefault();
            } else {
                const content = this.target.textContent;
                this.target.textContent = content.slice(0, position) + e.key + content.slice(position);
                this.editor.focus();
                this.setCursorPosition(this.editor, this.position);
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
                    <input type="color" id="idColor" onChange={this.getColor.bind(this)}></input>
                </section>
                <div className="editor"
                    aria-label="rdw-editor"
                    contentEditable="true"
                    role="textbox"
                    onClick={this.click.bind(this)}
                    onKeyDown={this.keyDow.bind(this)}
                    onSelect={this.selectInEditor.bind(this)}
                >
                    <div><span className="" id="firstSpan">  </span></div>
                </div>
            </main>
        )
    }
}

export default Main;
