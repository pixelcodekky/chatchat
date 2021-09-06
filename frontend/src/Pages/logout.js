import React, {useEffect} from 'react';
import { Redirect } from 'react-router';

const Logout = (props) => {

    localStorage.removeItem('CHATCHAT_token');

    return <Redirect to='/login' />
}

export default Logout;