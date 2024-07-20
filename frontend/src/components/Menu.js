// frontend/src/components/Menu.js

import React from 'react';

const Menu = ({ onMenuSelect }) => {
    return (
        <nav className="menu">
            <ul>
                <li>
                    <button onClick={() => onMenuSelect('new')}>Create a New Note</button>
                </li>
                <li>
                    <button onClick={() => onMenuSelect('search')}>Search Notes</button>
                </li>
                <li>
                    <button onClick={() => onMenuSelect('labels')}>Label View</button>
                </li>
                <li>
                    <button onClick={() => onMenuSelect('archived')}>Archived Notes</button>
                </li>
                <li>
                    <button onClick={() => onMenuSelect('trash')}>Trash Notes</button>
                </li>
            </ul>
        </nav>
    );
};

export default Menu;
