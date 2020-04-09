import React from 'react';

import { ReactComponent as Logo } from '../assets/images/Logo.svg';

function Header() {
    return (
        <Logo style={{
            maxHeight: "15vh",
            marginTop: "8px",
            marginBottom: "35px"
        }} />
    )
}

export default Header;