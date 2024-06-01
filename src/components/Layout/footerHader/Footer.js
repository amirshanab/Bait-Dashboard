import React from 'react';
import {DashColor} from "../../../Utils/DashColor";
const Footer = () => {
    return (
        <footer style={{backgroundColor: DashColor.primary, color: '#fff', padding: '10px 20px', textAlign: 'center', position: 'fixed', bottom: 0, width: '100%'}}>
            © 2024 Admin Dashboard
        </footer>
    );
}

export default Footer;
