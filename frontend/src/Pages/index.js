import React, {useEffect} from 'react'

const Index = (props) => {

    useEffect(() => {
        const token = localStorage.getItem('CHATCHAT_token');
        //console.log(token);
        if(!token){
            props.history.push('./login');
        }else{
            props.history.push('/dashboard');
        }

        // eslint-disabled-next-line

    },[]);

    return (
        <div>
            
        </div>
    )
}

export default Index
