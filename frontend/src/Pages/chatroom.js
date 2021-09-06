import React ,{useEffect, useState, useRef} from "react";
import { withRouter,Link } from "react-router-dom";

import axios from "axios";
import makeToast from '../Toaster';

const Chatroom = ({ match, socket }) => {
  console.log(match);
  const chatroomId = match.params.Id;
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const searchRef = useRef();
  const messageContentRef = useRef();
  const [userId, setUserId] = useState("");
  const [chatroomName, setChatRoomName] = useState(null);
  const objMessage = {message:'',name:'',userId:''};

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });

      messageRef.current.value = "";
    }
  };

  const getAllMesages = () => {
    const objmessages = axios.get(`http://localhost:8800/api/message/${chatroomId}`,{
      headers: {
        Authorization: "Bearer " + localStorage.getItem('CHATCHAT_token'),
      },
    }).then((response) => {
      //console.log(response.data)
      const resMessages = response.data;
      resMessages.map( async (message) => {
        const user = await axios.get(`http://localhost:8800/api/user/${message.user}`).then((res) => {
          return res.data;
        });
        
        setMessages((prev) => [...prev, {message: message.message,name: user.username, userId: user._id}])
      })
    }).catch((err) => { });
  }

  const getRoom = () => {
    const objroom = axios.get(`http://localhost:8800/api/chatroom/${chatroomId}`,{
      headers: {
        Authorization: "Bearer " + localStorage.getItem('CHATCHAT_token'),
      },
    }).then((response) => {
      setChatRoomName(response.data.name);
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

  useEffect(() => {

    const token = localStorage.getItem("CHATCHAT_token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }

    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });
    }
  }, [messages]);

  useEffect(() => {
    getRoom();
    if(messages.length === 0){
      getAllMesages();
    }
    
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }

    return () => {
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="roomHeader">
          {/* <div><Link to='/dashboard'>Back</Link></div> */}
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
  );
};

export default withRouter(Chatroom);