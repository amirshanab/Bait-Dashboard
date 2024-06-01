import React from 'react';
import {DashColor} from "../../../Utils/DashColor";

const Header = () => {
    return (
        <header style={{backgroundColor: DashColor.primary, color: '#fff', padding: '10px 20px', textAlign: 'center'}}>
            Admin Dashboard
        </header>
    );
}

export default Header;
