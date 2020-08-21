import React from 'react';

import '../assets/Header.css';

import ModalFrames from '../components/ModalFrames';

function Header(props) {
    return (
        <>
            <div className="app__header">
                <div className="left">
                    <img
                        className="app__headerImage mt-2"
                        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                        alt=""
                        height="29"
                    />
                </div>
                <div className="right">
                    <ModalFrames />
                </div>
            </div>
        </>
    );
}

export default Header;