import React from 'react';
import './Aside.scss';
import { NavLink } from 'react-router-dom'

const Aside = () => {
    return (
        <aside className="aside">
            <nav className="nav">
                <ul>
                    <li>
                        <NavLink
                            to="/"
                            exact
                        >Editor</NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" activeStyle={{
                            color: 'blue'
                        }}>About</NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default Aside;
