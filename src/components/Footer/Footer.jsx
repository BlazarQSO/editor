import React from 'react';
import './Footer.scss';
import icon from '../../assets/icons/logo-github.png';

const Footer = () => {
    return (
        <footer className="footer">
            <label className="footer__title">Iukou Siarhei</label>
            <img className="footer__img" src={icon} width="50" height="50" alt="" />
            <label className="footer__label">My GitHub:</label>
            <a href="https://github.com/BlazarQSO" className="footer__link" target="_blank" rel="noreferrer">github.com/BlazarQSO</a>
        </footer>
    )
}

export default Footer;
