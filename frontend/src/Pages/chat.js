import React ,{useEffect, useState, useRef} from "react";
import { withRouter,Link } from "react-router-dom";
import axios from "axios";

const Chat = ({match, socket}) => {
    const chatroomId = match.params.Id;
    const [messages, setMessages] = useState([]);
    const messageRef = useRef();
    const searchRef = useRef();
    const messageContentRef = useRef();
    const [userId, setUserId] = useState('');
    const [chatroomName, setChatRoomName] = useState(null);
    const [users, setUsers] = useState([{}]);

    const sendMessage = () => {
        if (socket) {
          socket.emit("chatroomMessage", {
            chatroomId,
            message: messageRef.current.value,
          });
    
          messageRef.current.value = "";
        }
    };

    const getAllMesages = async () => {
        getAllUser();
        axios.get(`http://localhost:8800/api/message/${chatroomId}`,{
          headers: {
            Authorization: "Bearer " + localStorage.getItem('CHATCHAT_token'),
          },
        }).then((response) => {
            const resMessages = response.data;
            //loop message
            resMessages.map((message) => {
                const msguser = users.filter((user) => {
                    //console.log('user:',user) 
                    //console.log('messageuser:',message.user)
                    const tmp = user._id;
                    return message.user === tmp
                });
                setMessages((prev) => [...prev, {message: message.message,name: msguser[0].username, userId: msguser[0]._id}])
          })
        }).catch((err) => {
            console.log(err);
         });
         
      }

    const searchHandler = () => {
        const query = searchRef.current.value
        if(!query){
          //console.log(messageContentRef.current);
          while (messageContentRef.current.firstChild) {
            messageContentRef.current.removeChild(messageContentRef.current.lastChild);
          }
          getAllMesages();
        }
        const filtermsg = filtermessage(messages,query);
        setMessages(filtermsg);
    }

    const filtermessage = (lstmsg, query) => {
        if(!query){
            return lstmsg;
        }

        return lstmsg.filter((msg) => {
            const tmpmsg = msg.message.toLowerCase();
            console.log(tmpmsg);
            return tmpmsg.includes(query);
        });
    }

    const getAllUser = async () => {
        const responseUsers = await axios.get(`http://localhost:8800/api/user/`,{
            headers: {
                Authorization: "Bearer " + localStorage.getItem('CHATCHAT_token'),
              },
        }).then((res) => {
            return res.data;
        });
        //console.log(responseUsers);
        setUsers(responseUsers);
        console.log(users);
    }

    const getUser = async () => {
        const user = await axios.get(`http://localhost:8800/api/user/${chatroomId}`,{
            headers: {
                Authorization: "Bearer " + localStorage.getItem('CHATCHAT_token'),
              },
        }).then((res) => {
            return res.data;
        });
        setChatRoomName(user.username);
    }

    useEffect(() => {
        if (socket) {
          socket.on("newMessage", (message) => {
            const newMessages = [...messages, message];
            setMessages(newMessages);
          });
        }
      }, [messages]);

    useEffect(() => {
        // clear chat history
        while (messageContentRef.current.firstChild) {
            messageContentRef.current.removeChild(messageContentRef.current.lastChild);
        }
        if (socket) {
            socket.emit("joinRoom", {
                chatroomId,
            });

            const token = localStorage.getItem("CHATCHAT_token");
            if (token) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUserId(payload.id);
            }

            getUser();
            
        }
        getAllMesages();
        //Leave page
        return () => {
          if (socket) {
            socket.emit("leaveRoom", {
              chatroomId,
            });
          }
        };
        // eslint-disable-next-line
    }, [socket]);

    return (
        <div className="chatroomPage">
        <div className="chatroomSection">
            <div className="roomHeader">
            <label className="cardTitle"><Link to='/dashboard'>&#60;</Link>  {chatroomName}</label>
            </div>
            <div className="searchContent">
            <div>
            <input type="text" ref={searchRef} placeholder="Search chat"></input>
            </div>
            <div>
            <button className="search" onClick={searchHandler}>
                Search
                </button>
            </div>
            </div>
            <div className="chatroomContent" ref={messageContentRef}>
            {messages.map((message, idx) => (
                <div key={idx} className={ userId === message.userId ? "own-message" : "message"} >
                <span
                    className={
                    userId === message.userId ? "ownMessage" : "otherMessage"
                    }
                >
                    {message.name}:
                </span>{" "}
                {message.message}
                </div>
            ))}
            </div>
            <div className="chatroomActions">
            <div>
                <input
                type="text"
                name="message"
                placeholder="Aa"
                ref={messageRef}
                />
            </div>
            <div>
                <button className="join" onClick={sendMessage}>
                Send
                </button>
            </div>
            </div>
        </div>
        </div>
    )
};

export default withRouter(Chat);