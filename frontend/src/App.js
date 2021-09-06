import React, {useState, useEffect} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Login from './Pages/login';
import register from './Pages/register';
import Dashboard from './Pages/dashboard';
import index from './Pages/index';
import Chatroom from './Pages/chatroom';
import Chat from './Pages/chat';
import io from 'socket.io-client';
import makeToast from './Toaster';

import './Styles/site.css';
import './Styles/chatroom.css';


function App() {
  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem('CHATCHAT_token');
    if (token){
      const consocket = io('http://localhost:8800',{
          query: {
              token: localStorage.getItem('CHATCHAT_token')
          }
      });

      consocket.on('disconnect', () => {
        setSocket(null);
        setTimeout(setupSocket, 5000);
        makeToast('error','Disconnected!');
      });

      consocket.on('connect', () =>{
        //makeToast('success','Connected!');
      });

      setSocket(consocket);

    }
  }

  useEffect(() => {
    setupSocket();
    //eslint-disabled-next-line
  },[]);

  return <BrowserRouter>
    <Switch>
      <Route exact path='/' component={index}></Route>
      <Route exact path='/login' render={() => <Login setupSocket={setupSocket} /> }></Route>
      <Route exact path='/register' component={register}></Route>
      <Route exact path='/dashboard' render={() => <Dashboard socket={socket}/> }></Route>
      <Route exact path='/chatroom/:Id' render={() => <Chatroom socket={socket}/> } ></Route>
      <Route exact path='/chat/:Id' render={() => <Chat socket={socket} />} ></Route>

    </Switch>
  </BrowserRouter>
}

export default App;
