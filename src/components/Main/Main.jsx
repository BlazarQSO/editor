import React from 'react';
import './Main.scss';
import ButtonStyle from '../Buttons/ButtonStyle';
import ControlBlock from '../Control/ControlBlock';
import SaveBlock from '../Control/SaveBlock';
import Modal from '../Modal/Modal';

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
            ],
            classes: ['']
        }
        this.font = 'Roboto';
        this.keyDow = this.keyDow.bind(this);
        this.getCursorPosition = this.getCursorPosition.bind(this);
        this.setCursorPosition = this.setCursorPosition.bind(this);
        this.findOutCurElement = this.findOutCurElement.bind(this);
    }

    componentDidMount() {
        this.editor = document.querySelector('.editor');
        const firstSpan = document.getElementById('firstSpan');
        this.setCursorPosition(firstSpan, 1);
    }

    initContent() {
        // const div = document.createElement('div');
        // const span = document.createElement('span');
        // span.id = 'firstSpan';
        // div.append(span);
        // this.editor.prepend(div);
        this.editor.innerHTML = '<div><span id="firstSpan">  </span></div>';
    }

    findOutCurElement() {
        const { focusNode } = document.getSelection();
        if (focusNode && focusNode.data && focusNode.data.length > 0) {
            this.target = focusNode.parentElement;
        }
    }

    getColor() {
        this.color = document.querySelector('#idColor').value;
        const selectText = document.getSelection().toString();
        if (selectText.length > 0) {
            this.addStyleToSelectedText({ isChangedColor: true });
        } else {
            this.editor.focus();
            this.setCursorPosition(this.editor, this.position);
        }
    }

    setColor() {
        this.color = window.getComputedStyle(this.target, null).getPropertyValue('color');
        if (this.color) {
            const rgbToHex = (r, g, b) => '#' + [r, g, b]
                .map(x => x.toString(16).padStart(2, '0')).join('');

            const hex = rgbToHex(...this.color.slice(4, this.color.length - 1)
                .split(', ').map((n) => +n));

            document.querySelector('#idColor').value = hex;
        }
    }

    setFontFamily() {
        let font = window.getComputedStyle(this.target, null).getPropertyValue('font-family');
        if (font) {
            font = font.replace(/"/g, '');
            this.font = (this.changeFamily) ? this.font : font;
            this.changeFamily = false;

            Array.from(document.getElementById('fontFamily'))
                .map((option) => (option.value === this.font) ? option.selected = true : option);
        }
    }

    selectInEditor() {
        this.findOutCurElement();
        this.position = this.getCursorPosition(this.editor);

        let { buttons, classes } = this.state;

        this.setColor();
        this.setFontFamily();

        if (this.target.tagName === 'SPAN') {
            classes = [...this.target.classList];
            buttons = buttons.map((button) => {
                button.active = classes.includes(button.className);
                return button;
            });
            this.setState({ buttons, classes });
        }
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

    addStyleToSelectedText({ nameClass, isAddingClass, isChangedColor, isChangedFont }) {
        let { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection();

        if (anchorNode === focusNode) {
            if (anchorOffset > focusOffset) {
                const temp = anchorOffset;
                anchorOffset = focusOffset;
                focusOffset = temp;
            }

            const anchorContent = anchorNode.textContent;
            if (anchorOffset === 0 && focusOffset === anchorContent.length) {
                if (nameClass && isAddingClass) {
                    anchorNode.parentElement.classList.add(nameClass);
                    if (nameClass === 'sub') anchorNode.parentElement.classList.remove('super');
                    if (nameClass === 'super') anchorNode.parentElement.classList.remove('sub');
                } else if (nameClass) {
                    anchorNode.parentElement.classList.remove(nameClass);
                }
                if (this.color) anchorNode.parentElement.style.color = this.color;
                if (this.font) anchorNode.parentElement.style.fontFamily = this.font;
                return;
            }

            const span = document.createElement('span');
            span.className = anchorNode.parentElement.className;
            if (nameClass && isAddingClass) {
                span.classList.add(nameClass);
                if (nameClass === 'sub') span.classList.remove('super');
                if (nameClass === 'super') span.classList.remove('sub');
            } else if (nameClass) {
                span.classList.remove(nameClass);
            }

            if (this.color) span.style.color = this.color;
            if (this.font) span.style.fontFamily = this.font;
            anchorNode.textContent = anchorContent.slice(0, anchorOffset);
            span.textContent = anchorContent.slice(anchorOffset, focusOffset);

            anchorNode.parentElement.after(span);

            const lastSpan = document.createElement('span');
            if (anchorContent.length > focusOffset) {
                lastSpan.className = anchorNode.parentElement.className;
                const color = window.getComputedStyle(anchorNode.parentElement, null).getPropertyValue('color');
                const font = window.getComputedStyle(anchorNode.parentElement, null).getPropertyValue('font-family');
                if (color) lastSpan.style.color = color;
                if (font) lastSpan.style.fontFamily = font;
                lastSpan.textContent = anchorContent.slice(focusOffset);
                span.after(lastSpan);
            }

            this.editor.childNodes.forEach((div) => {
                div.childNodes.forEach((span) => {
                    if (span.textContent === '') span.remove();
                })
            })
        } else {
            let reverse = null;
            this.editor.childNodes.forEach((div) => {
                div.childNodes.forEach((span) => {
                    if (span === focusNode.parentElement && reverse === null) reverse = true;
                    if (span === anchorNode.parentElement && reverse === null) reverse = false;
                });
            });
            if (reverse) {
                let temp = focusNode;
                focusNode = anchorNode;
                anchorNode = temp;
                temp = focusOffset;
                focusOffset = anchorOffset;
                anchorOffset = temp;
            }

            const innerNodes = [];
            let push = false;
            this.editor.childNodes.forEach((div) => {
                div.childNodes.forEach((span) => {
                    if (span === focusNode.parentNode) push = false;
                    if (push) innerNodes.push(span);
                    if (span === anchorNode.parentNode) push = true;
                });
            });

            innerNodes.forEach((node) => {
                if (nameClass && isAddingClass) {
                    node.classList.add(nameClass);
                    if (nameClass === 'sub') node.classList.remove('super');
                    if (nameClass === 'super') node.classList.remove('sub');
                } else if (nameClass) {
                    node.classList.remove(nameClass);
                }
                if (isChangedColor) node.style.color = this.color;
                if (isChangedFont) node.style.fontFamily = this.font;
            })

            const anchorContent = anchorNode.textContent;
            const span = document.createElement('span');
            span.className = anchorNode.parentElement.className;
            if (nameClass && isAddingClass) {
                span.classList.add(nameClass);
                if (nameClass === 'sub') span.classList.remove('super');
                if (nameClass === 'super') span.classList.remove('sub');
            } else if (nameClass) {
                span.classList.remove(nameClass);
            }

            if (isChangedColor) {
                if (this.color) span.style.color = this.color;
            } else {
                const color = window.getComputedStyle(anchorNode.parentElement, null).getPropertyValue('color');
                if (color) span.style.color = color;
            }
            span.style.fontFamily = (isChangedFont) ?
                this.font : window.getComputedStyle(anchorNode.parentElement, null).getPropertyValue('font-family');

            anchorNode.textContent = anchorContent.slice(0, anchorOffset);
            span.textContent = anchorContent.slice(anchorOffset);

            anchorNode.parentElement.after(span);



            const focusContent = focusNode.textContent;
            const spanPrevEnd = document.createElement('span');
            spanPrevEnd.className = focusNode.parentElement.className;
            if (nameClass && isAddingClass) {
                spanPrevEnd.classList.add(nameClass);
                if (nameClass === 'sub') spanPrevEnd.classList.remove('super');
                if (nameClass === 'super') spanPrevEnd.classList.remove('sub');
            } else if (nameClass) {
                spanPrevEnd.classList.remove(nameClass);
            }

            if (isChangedColor) {
                if (this.color) spanPrevEnd.style.color = this.color;
            } else {
                const color = window.getComputedStyle(focusNode.parentElement, null).getPropertyValue('color');
                if (color) spanPrevEnd.style.color = color;
            }
            spanPrevEnd.style.fontFamily = (isChangedFont) ?
                this.font : window.getComputedStyle(focusNode.parentElement, null).getPropertyValue('font-family');

            focusNode.textContent = focusContent.slice(focusOffset);
            spanPrevEnd.textContent = focusContent.slice(0, focusOffset);

            focusNode.parentElement.before(spanPrevEnd);
        }
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

        const selectText = document.getSelection().toString();
        if (selectText.length > 0) {
            const button = buttons.find((button) => button.value === value);
            this.addStyleToSelectedText({ nameClass: button.className, isAddingClass: button.active });
        } else {
            this.editor.focus();
            this.setCursorPosition(this.editor, this.position);
        }
        this.setState({ buttons, classes });
    }

    keyDow(e) {
        if (this.editor.innerHTML === '' || this.editor.innerHTML === '<br>') this.initContent();
        const position = this.getCaretPosition();
        const selected = document.getSelection().toString().length; // это лишнее - оптимизировать условие
        const { classes } = this.state;

        console.log(this.position);
        const { focusNode, focusOffset } = document.getSelection();
        if (e.key === 'Enter' && focusOffset === focusNode.textContent.length) {
            const div = document.createElement('div');
            const span = document.createElement('span');
            span.innerHTML = ' ';
            div.append(span);
            const curDiv = Array.from(this.editor.childNodes).find((div) => div === this.target.parentNode);
            if (curDiv) curDiv.after(div);
            span.className = curDiv.childNodes[curDiv.childNodes.length - 1].className;
            span.style.color = this.color;
            span.style.fontFamily = this.font;
            this.setCursorPosition(span, 1);
            e.preventDefault();
        }
        console.log(e.key);
        if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
            if (this.position === 1) e.preventDefault();
        }


        if (selected === 0 && e.key.length < 2) {
            let isNewTextStyle = [...this.target.classList].sort().join() !== classes.sort().join();
            const color = window.getComputedStyle(this.target, null).getPropertyValue('color');
            if (color !== this.color) isNewTextStyle = true;
            let font = window.getComputedStyle(this.target, null).getPropertyValue('font-family');
            font = font.replace(/"/g, '');
            if (font !== this.font) isNewTextStyle = true;

            const newSpan = `<span class="${classes.join(' ')}">${e.key}</span>`;
            this.position = this.getCursorPosition(this.editor) + 1;
            if (this.target.tagName !== 'SPAN') {
                // this.target.innerHTML = newSpan;
                // this.editor.focus();
                // this.setCursorPosition(this.editor, this.position);
                // e.preventDefault();
            } else if (isNewTextStyle) {
                const span = document.createElement('span');
                span.className = classes.join(' ');
                span.textContent = e.key;
                const content = this.target.innerHTML;
                if (this.color) span.style.color = this.color;
                if (this.font) span.style.fontFamily = this.font;

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

    saveText() {
        const text = JSON.stringify(this.editor.innerHTML);
        const autoLink = document.createElement('a');
        autoLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        autoLink.setAttribute('download', 'editor');
        autoLink.style.display = 'none';
        document.body.appendChild(autoLink);
        autoLink.click();
        document.body.removeChild(autoLink);
    }

    readFile() {
        const input = document.getElementById('file');

        let file = input.files[0];

        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            this.editor.innerHTML = JSON.parse(reader.result);
        };
        reader.onerror = () => {
            console.log(reader.error);
        };
    }

    openModal() {
        this.elemPosition = this.getCaretPosition();
        document.getElementById('modalLink').classList.add('show');
        document.getElementById('nameLink').focus();
    }

    closeModal() {
        document.getElementById('modalLink').classList.remove('show');
    }


    formingLinkElement({ name, link }) {
        const { classes } = this.state;

        const linkElem = document.createElement('a');
        const reg = new RegExp('^(http|https)://', 'i');
        if (reg.test(link)) {
            linkElem.setAttribute('href', link);
        } else {
            linkElem.setAttribute('href', 'http://' + link);
        }

        linkElem.setAttribute('title', link);
        linkElem.setAttribute('target', '_blank');
        linkElem.innerHTML = `<span class="${String(`${classes.join(' ')} link`).trim()}">${name}</span>`;
        return linkElem;
    }

    getLinkStyles({ contextLastElem, linkElem }) {
        if (contextLastElem.length > 0) {
            const nextElem = document.createElement('span');
            nextElem.className = [...this.target.classList].join(' ');
            nextElem.style.color = this.color;
            nextElem.style.font = this.font;
            nextElem.textContent = contextLastElem;
            linkElem.after(nextElem);
        }
    }

    createLink() {
        const name = document.getElementById('nameLink').value;
        const link = document.getElementById('link').value;
        this.closeModal();
        if (name && link) {
            const linkElem = this.formingLinkElement({name, link});

            const content = this.target.innerHTML;
            this.target.textContent = content.slice(0, this.elemPosition);
            const contextLastElem = content.slice(this.elemPosition);
            this.target.after(linkElem);

            this.getLinkStyles({ contextLastElem, linkElem });

            this.target = linkElem;
            this.editor.focus();
            this.position += name.length;
            this.setCursorPosition(this.editor, this.position);
        }
    }

    savePDF() {
        const pdf = new jsPDF('p', 'pt', 'letter');
        pdf.canvas.height = 72 * 11;
        pdf.canvas.width = 72 * 8.5;

        pdf.fromHTML(this.editor);

        pdf.save('editorText.pdf');
    }

    changeFontFamily(e) {
        this.font = e.target.value;
        this.changeFamily = true;
        const selectText = document.getSelection().toString();
        if (selectText.length > 0) {
            this.addStyleToSelectedText({ isChangedFont: true });
        } else {
            this.editor.focus();
            this.setCursorPosition(this.editor, this.position);
        }
    }

    render() {
        return (
            <main className="main">
                <section className="control">
                    <div className="control__block">
                        {this.state.buttons.map((button, index) => {
                            return <ButtonStyle
                                key={index}
                                clickBtn={this.clickBtn.bind(this)}
                                active={button.active}
                                className={button.className}
                                value={button.value}
                            />
                        })}
                    </div>
                    <div className="control__block">
                        <ControlBlock
                            getColor={this.getColor.bind(this)}
                            changeFontFamily={this.changeFontFamily.bind(this)}
                            clickBtn={this.openModal.bind(this)}
                        />
                    </div>
                    <div className="control__block">
                        <SaveBlock
                            saveText={this.saveText.bind(this)}
                            savePDF={this.savePDF.bind(this)}
                            readFile ={this.readFile.bind(this)}
                        />
                    </div>
                </section>
                <div className="editor"
                    contentEditable="true"
                    onKeyDown={this.keyDow.bind(this)}
                    onSelect={this.selectInEditor.bind(this)}
                >
                    <div><span className="" id="firstSpan">  </span></div>
                </div>
                <Modal
                    closeModal={this.closeModal.bind(this)}
                    createLink={this.createLink.bind(this)}
                    link={this.link}
                />
            </main>
        )
    }
}

export default Main;
