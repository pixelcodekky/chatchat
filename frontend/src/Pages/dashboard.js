import React, {useState, useEffect, useRef, Fragment} from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import { Link } from 'react-router-dom';

//rafce
const Dashboard = (props) => {

    const [chatrooms, setChatRooms] = useState([]);
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState({});
    const [userlist, setUserList] = useState([]);
    const refChatRoomName = useRef();
    
    const getChatRooms = () => {
        axios.get('http://localhost:8800/api/chatroom/',{
            headers: {
                Authorization: "Bearer " + localStorage.getItem('CHATCHAT_token'),
            }
        }).then((res) => {
            setChatRooms(res.data);
        }).catch((err) => {
            setTimeout(getChatRooms, 2000);
        })
    }

    const createChatRoom = () => {
        const name = refChatRoomName.current.value
        axios.post('http://localhost:8800/api/chatroom/',{name},{
            headers: {
                Authorization: "Bearer " + localStorage.getItem('CHATCHAT_token'),
            }
        }).then((res) => {
            console.log(res);
            refChatRoomName.current.value = '';
            getChatRooms();
        }).catch((err) => {
            console.log(err);
        })
    }

    const getAllUsers = () => {
        axios.get('http://localhost:8800/api/user/',{
            headers: {
                Authorization: "Bearer " + localStorage.getItem('CHATCHAT_token'),
            }
        }).then((res) => {
            const filterusers = res.data.filter((user) => {
                return user._id !== userId;
            });
            setUserList(filterusers);

            const currentUser = res.data.filter((user) => {return user._id === userId;});
            setUser(currentUser[0]);
        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        const token = localStorage.getItem("CHATCHAT_token");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserId(payload.id);
        }
    },[]);

    useEffect(() => {
        getChatRooms();
        if(userId){
            getAllUsers();
        }
    },[userId]);

    return (
        <Fragment>
            <div className="card">
                
                <div className="chatroom">
                    <Link to='/logout'><div className="logout">Logout</div></Link> 
                    <div>{user && `Welcome, ${user.username}` }</div>
                </div>
                <div className="col-list">
                    <div className="cardBody">
                        <h3 className="login-header">Create Chat Room</h3>
                        <div className="inputGroup">
                            <label htmlFor="email">Chat Room name</label>
                            <input type="text" name="chatroomname" id="chatroomname" placeholder="Chat Chat" ref={refChatRoomName}></input>
                        </div>
                        
                        <button onClick={createChatRoom}>Create Room</button>
                        <h4>Room List</h4>
                        <div className="chatrooms">
                            {chatrooms.map((chatroom) => (
                                <div className="chatroom" key={chatroom._id}>
                                    <div>{chatroom.name}</div>
                                <Link to={`/chatroom/${chatroom._id}`}><div className="join">Join</div></Link> 
                            </div>
                            ))}
                        </div>
                    </div>
                    <div className="cardBody">
                        <h4>Friend List</h4>
                        <div className="chatrooms">
                            {userlist.map((user) => (
                                <div className="chatroom" key={user._id}>
                                <div className="user-item">{user.username}</div>
                                <Link to={`/chat/${user._id}`} className="join">Chat</Link>
                            </div>
                            ))}
                            
                        </div>
                    </div>
                </div>
                
                

            </div>
            
        </Fragment>
        
    )
}

export default Dashboard
