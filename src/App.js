import "./App.css";
import image from "./img/bot_image.png";
import { useState, useRef, useMemo  } from "react";
import { IconContext } from "react-icons";
import { BsChevronDown, BsChatLeftFill, BsChatLeft} from 'react-icons/bs';
import { BiMicrophoneOff, BiMicrophone } from 'react-icons/bi';
import {RiSendPlaneFill} from 'react-icons/ri'

function App() {
  
  const humanMessage = useRef();
  const botmessage = useRef();
  const input = useRef();

  const [chatScreen, setChatScreen] = useState(false);
  const chatScreentoggle = () => {
    console.log("clicked")
    setChatScreen(true)
  }
  const [secondScreen, setSecondScreen] = useState(false);
  const secondScreentoggle = () => {
    console.log("hello")
    setSecondScreen(true)
    document.querySelector('.chat-bot-first-screen-chat-bot-wrapper').style.display = "none";
  }

  const [chatIcon, setchatIcon] = useState(false);
  const [microphoneIcon, setmicrophoneIcon] = useState(false);
  const minimizeHandle = () => {
    console.log("minimize clicked")
    window.location.reload(true);
  }

  const checkStatus = (e) => {
      //
  };
  const handleInput = () => {
    const botMessage = document.querySelector("#message1");
    const userMessage = document.querySelector("#message2");
    const inputRef = input.current;
    const getHumanMessage = humanMessage.current;
    const getBotMessage = botmessage.current;

    let badwords = ["Hi|fuck|bad|stupid|useless|bitch|crazy|nonsense"];
    let words = new RegExp(badwords);
    if (words.test(document.querySelector("#input").value)) {
      // if the input contains bad words
      getBotMessage.innerText = "Typing...";
      setTimeout(() => {
        getBotMessage.innerText = "Hello"; // display the message
        inputRef.value = ""; // clear the input
      }, 2000);
    }
    getHumanMessage.innerText = inputRef.value; // display the message
  };
  return (
    <div className="Chat-bot-app" onLoad={checkStatus}>
      <div className={chatScreen === true ? "chat-bot-icon-hide " : "chat-bot-icon"} onClick={() => chatScreentoggle()} onPointerEnter={() => setchatIcon(!chatIcon)} onPointerLeave={() => setchatIcon(!chatIcon)}>
      <IconContext.Provider value={{ className: 'chat-react-icons' }}>
        {chatIcon ? <BsChatLeft /> : <BsChatLeftFill /> }
      </IconContext.Provider>
      </div>
      <div className={chatScreen === false ? "chat-bot-first-screen-chat-bot-wrapper-hide" : "chat-bot-first-screen-chat-bot-wrapper"}>
        <div className="chat-bot-first-screen">
          <div className="chat-bot-first-screen-title">
            Let’s chat!
          </div>
          <div className="chat-bot-first-screen-text">
            <p>Hi !👋 How Can I help you?</p>
          </div>
          <div className="chat-bot-first-screen-main">
            <div className="chat-bot-btn-div">
              <div className="chat-bot-btn-group">
                <button> Flip List Reports</button>
                <button >Antwalk </button>
                <button >Statistics</button>
                <button onClick={() => secondScreentoggle()}>Start Chat</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={secondScreen === false ? "chat-bot-wrapper-hide" : "chat-bot-wrapper"}>
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
                <div id="menu-wrap" onClick={()=> minimizeHandle()}>
                  <BsChevronDown/>
                </div>
            </div>
          </div>
          <div className="main">
            <div className="main_content">
              <div className="messages">
                <div
                  className="bot-message"
                  id="message1"
                  ref={botmessage}
                ></div>
                <div
                  className="human-message"
                  id="message2"
                  ref={humanMessage}
                ></div>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className="btm">
              <div className="input">
                <input
                  type="text"
                  id="input"
                  placeholder="Enter your message"
                  ref={input}
                />
              </div>
              <div className="mikebtn">
                <button onClick={() => setmicrophoneIcon(!microphoneIcon)}>
                  {microphoneIcon ? <BiMicrophoneOff/> : <BiMicrophone/> }
                </button>
              </div>
              <div className="btn">
                <button onClick={() => handleInput()}>
                  <RiSendPlaneFill/>
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
