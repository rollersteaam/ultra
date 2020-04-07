import React from 'react';

import { ReactComponent as Logo } from '../assets/images/Logo.svg';

function Header() {
    return (
        <Logo className="mb-4" style={{maxHeight: "15vh"}} />
    )
}

export default Header;