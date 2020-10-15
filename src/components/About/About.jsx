import React from 'react';
import './About.scss';
import icon from '../../assets/icons/logo-github.png';

const About = () => {
    return (
        <section className="about">
            <p className="about__text">I am Iukou Siarhei, front end developer</p>
            <div className="about__git">
                <label className="about__git-title">My GitHub:</label>
                <img className="about__git-img" src={icon} width="50" height="50" alt="" />
                <a href="https://github.com/BlazarQSO" className="about__git-link" target="_blank" rel="noreferrer">github.com/BlazarQSO</a>
            </div>
        </section>
    )
}

export default About;
