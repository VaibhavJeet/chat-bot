import "./App.css";
import axios from 'axios';
import image from "./img/bot_image.png";
import { useState, useRef, useMemo, useEffect  } from "react";
import { IconContext } from "react-icons";
import { BsChevronDown, BsChatLeftFill, BsChatLeft} from 'react-icons/bs';
import { BiMicrophoneOff, BiMicrophone } from 'react-icons/bi';
import {RiSendPlaneFill} from 'react-icons/ri'


function App() {


const [chatIcon, setChatIcon] = useState(false);

const chatIconElement = useMemo(() => {
  return (
    <IconContext.Provider value={{ className: 'chat-react-icons' }}>
      {chatIcon ? <BsChatLeft /> : <BsChatLeftFill />}
    </IconContext.Provider>
  );
  }, [chatIcon]);
  const chatMessagesRef = useRef(null);
  const humanMessage = useRef();
  const botmessage = useRef();
  const input = useRef();

  const [chatScreen, setChatScreen] = useState(false);
  const chatScreentoggle = () => {
    setChatScreen(true)
  }
  const [secondScreen, setSecondScreen] = useState(false);
  const secondScreentoggle = () => {
    setSecondScreen(true)
    document.querySelector('.chat-bot-first-screen-chat-bot-wrapper').style.display = "none";
  }

const [microphoneIcon, setmicrophoneIcon] = useState(false);


//Get Time Start
function getTime() {
  let today = new Date();
  let hours = today.getHours();
  let minutes = today.getMinutes();

  if (hours < 10) {
      hours = "0" + hours;
  }

  if (minutes < 10) {
      minutes = "0" + minutes;
  }

  let time = hours + ":" + minutes;
  return time;
}

const [chatTime, setChatTime] = useState("");

useEffect(() => {
  // Call getTime() function to get the current time
  const time = getTime();
  // Update state with the current time
  setChatTime(time);
}, []);

//Get Time End

function botmsg()
{
  //
}
useEffect(() => {
  const botHtml = "Hi, I am your assistant. Please ask a question or choose from the list below";
  botmessage.current.innerHTML = botHtml;
}, []);

const handleInput = () => {
  const inputRef = input.current;
  const { current: getHumanMessage } = humanMessage;
  const { current: getBotMessage } = botmessage;

  const badwords = /hi|fuck|bad|stupid|useless|bitch|crazy|nonsense/i;
  const inputValue = inputRef.value;

  if (badwords.test(inputValue)) {
    // if the input contains words
    getBotMessage.innerText = "Typing...";
    setTimeout(() => {
      const botMessageText = "Hello";
      const botMessageEl = document.createElement("div");
      botMessageEl.className = "bot-message";
      botMessageEl.innerText = botMessageText;
      chatMessagesRef.current.appendChild(botMessageEl);
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      inputRef.value = ""; // clear the input
    }, 2000);
  } else {
    getBotMessage.innerText = "Typing...";
    setTimeout(() => {
      const botMessageText = "I'm sorry, I didn't understand.";
      const botMessageEl = document.createElement("div");
      botMessageEl.className = "bot-message";
      botMessageEl.innerText = botMessageText;
      chatMessagesRef.current.appendChild(botMessageEl);
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      inputRef.value = ""; // clear the input
    }, 2000);
  }
  if (inputValue.length > 0) {
    const humanMessageText = inputValue;
    const humanMessageEl = document.createElement("div");
    humanMessageEl.className = "human-message";
    humanMessageEl.innerText = humanMessageText;
    chatMessagesRef.current.appendChild(humanMessageEl);
    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    
    // clear the input
    inputRef.value = "";
  }
  // const humanMessageText = inputValue;

};



//Reloads ChatApp Start
const [reload, setReload] = useState(false);

const minimizeHandle = () => {
  console.log("minimize clicked")
  setReload(true);
}

if (reload) {
  return <App />;
}
//Reload Chat App End

return (
  <div className="Chat-bot-app">
    <div
      className={chatScreen === true ? "chat-bot-icon-hide " : "chat-bot-icon"}
      onClick={chatScreentoggle}
      onPointerEnter={() => setChatIcon(true)}
      onPointerLeave={() => setChatIcon(false)}
    >
      {chatIconElement}

    </div>
    <div
      className={
        chatScreen
          ? "chat-bot-first-screen-chat-bot-wrapper"
          : "chat-bot-first-screen-chat-bot-wrapper-hide"
      }
    >
      <div className="chat-bot-first-screen">
        <div className="chat-bot-first-screen-title">Let’s chat!</div>
        <div className="chat-bot-first-screen-text">
          <p>Hi !👋 How Can I help you?</p>
        </div>
        <div className="chat-bot-first-screen-main">
          <div className="chat-bot-btn-div">
            <div className="chat-bot-btn-group">
              <button>Flip List Reports</button>
              <button>Antwalk</button>
              <button>Statistics</button>
              <button onClick={secondScreentoggle}>Start Chat</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      className={
        secondScreen ? "chat-bot-wrapper" : "chat-bot-wrapper-hide"
      }
    >
      <div className="content">
        <div className="header">
          <div className="img">
            <img src={image} alt="" />
          </div>
          <div className="right">
            <div className="name">ChatBot</div>
            <div className="status">Active</div>
          </div>
          <div className="chat-bot-drop-down">
            <div id="menu-wrap" onClick={minimizeHandle}>
              <BsChevronDown />
            </div>
          </div>
        </div>
        <div className="main">
          <div className="main_content">
            <div className="messages" ref={chatMessagesRef}>
            <p>Chat started at: {chatTime}</p>
              <div className="bot-message" id="message1" ref={botmessage}></div>
              <div id="message2" ref={humanMessage}></div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="btm">
            <div className="input">
              <input type="text" id="input" placeholder="Enter your message" ref={input} />
            </div>
            <div className="mikebtn">
              <button onClick={() => setmicrophoneIcon(!microphoneIcon)}>
                {microphoneIcon ? <BiMicrophoneOff /> : <BiMicrophone />}
              </button>
            </div>
            <div className="btn">
              <button onClick={handleInput}>
                <RiSendPlaneFill />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}

export default App;

