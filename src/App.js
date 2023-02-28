import React, { useState, useRef, useMemo, useEffect } from "react";
import "./App.css";
import axios from 'axios';
import image from "./img/bot_image.png";
import { IconContext } from "react-icons";
import { BsChevronDown, BsChatLeftFill, BsChatLeft, BsMicMute, BsMic } from 'react-icons/bs';
import { RiSendPlaneFill } from 'react-icons/ri'






function App() {
  //for displaying top asked questions
  const [frequentlyAskedQuestions, setFrequentlyAskedQuestions] = useState({
  });
  const FAQ_COUNT = 5; // display top 5 frequently asked questions

  const mostFrequentlyAskedQuestions = Object.entries(frequentlyAskedQuestions)
    .sort((a, b) => b[1] - a[1]) // sort by count (descending order)
    .slice(0, FAQ_COUNT) // take the top N questions
    .map(([question, count]) => `${question} (${count} times)`)
    .join('\n');

  console.log('Most frequently asked questions:\n' + mostFrequentlyAskedQuestions);
  //top asked questions end


  ////----------------------------------------------------------------------------------------\\\\\  


  //for chat icon visibility on click
  const [chatIcon, setChatIcon] = useState(false);
  //for chat icon visibility on click end


  ////----------------------------------------------------------------------------------------\\\\\  

  //for giving icons custom css
  const chatIconElement = useMemo(() => {
    return (
      <IconContext.Provider value={{ className: "chat-react-icons" }}>
        {chatIcon ? <BsChatLeft /> : <BsChatLeftFill />}
      </IconContext.Provider>
    );
  }, [chatIcon]);
  //for giving icons custom css end


  ////----------------------------------------------------------------------------------------\\\\\   


  //for toggling between different screens of chatbot
  const [chatScreen, setChatScreen] = useState(false);
  const chatScreentoggle = () => {
    setChatScreen(true);
  };
  const [secondScreen, setSecondScreen] = useState(false);
  const secondScreentoggle = () => {
    setSecondScreen(true);
    document.querySelector(".chat-bot-first-screen-chat-bot-wrapper").style.display =
      "none";
  };
  //for toggling between different screens of chatbot end

  ////----------------------------------------------------------------------------------------\\\\\


  //for handling user message and bot reply 
  const chatMessagesRef = useRef(null);
  const humanMessage = useRef();
  const botmessage = useRef();
  const input = useRef();

  const [microphoneIcon, setMicrophoneIcon] = useState(false);
  const recognitionRef = useRef(null);

  const handleMicrophone = () => {
    setMicrophoneIcon(!microphoneIcon);

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true; // keep listening until stopped
    recognition.interimResults = true; // return results as they become available
    recognition.lang = 'en-US'; // set the language to English (US)
    recognition.onstart = () => {
      console.log('Listening...'); // log when speech recognition starts
    };
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      console.log(speechToText); // log the recognized text to the console
      input.current.value = speechToText;
      // use the recognized text to update your application state or perform any other action
    };
    recognition.onerror = (event) => {
      console.error(event.error); // log any errors that occur during speech recognition
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      console.log('Stopped listening.'); // log when speech recognition stops
      recognitionRef.current.stop();
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window && microphoneIcon) {
      stopSpeechRecognition();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN'; // set the language
      utterance.volume = 0.5; // set the volume (0 to 1)
      utterance.pitch = 1; // set the pitch (0 to 2)
      utterance.rate = 1.2; // set the rate (0.1 to 10)
      utterance.onend = () => {
        recognitionRef.current.start();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      console.log('Speech synthesis is not supported in your browser.');
    }
  };

  const [chatTime, setChatTime] = useState("");

  const handleLinkBtn = () => {
    const botMessagebtnEl = document.createElement("div");
    botMessagebtnEl.className = "bot-message";
    botMessagebtnEl.innerHTML = `<a href="https://www.youtube.com
    ">Click this link to go somewhere!!</a>`;
    chatMessagesRef.current.appendChild(botMessagebtnEl);
    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  }

  useEffect(() => {
    const botHtml = "Hi, I am your assistant. Please ask a question or choose from the list below";
    botmessage.current.innerHTML = botHtml;
  }, []);

  const API_KEY = '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';

  const callBot = async (msgFrmUser, callback) => {
    try {
      const question = msgFrmUser;
      const model = "text-davinci-003";
      const modelResponse = await axios.post(
        "https://api.openai.com/v1/engines/" + model + "/completions",
        {
          prompt: question + "?",
          temperature: 0,
          max_tokens: 300,

          top_p: 1,
          n: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
        }
      );
      // Update frequently asked questions
      setFrequentlyAskedQuestions((prev) => {
        const updated = { ...prev };
        updated[question] = (updated[question] || 0) + 1;
        return updated;
      });
      const botHtml = modelResponse.data.choices[0].text.trim();
      callback(botHtml);
    } catch (error) {
      console.error(error);
      callback("Sorry, I couldn't understand your question. Please try again.");
    }
  };


  const handleInputText = () => {
    const inputText = input.current.value.trim();
    if (inputText === '') return;
    const humanMessageEl = document.createElement("div");
    humanMessageEl.className = "human-message";
    humanMessageEl.innerHTML = inputText;

    if (inputText.endsWith('?')) { // check if it's a question
      setFrequentlyAskedQuestions(prev => {
        const question = inputText.toLowerCase();
        return {
          ...prev,
          [question]: (prev[question] || 0) + 1 // increment count or set to 1
        };
      });
    }

    chatMessagesRef.current.appendChild(humanMessageEl);
    input.current.value = '';
    setChatTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    callBot(inputText, (botResponse) => {
      const botMessageEl = document.createElement("div");
      botMessageEl.className = "bot-message";
      botMessageEl.innerHTML = botResponse;
      chatMessagesRef.current.appendChild(botMessageEl);
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      speak(botResponse);
      if (botResponse.includes("Click this link")) {
        setTimeout(handleLinkBtn, 2000);
      }
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleInputText();
    }
  };

  const handleInput = () => {
    handleInputText();
  };
  //for handling user message and bot reply 

  ////----------------------------------------------------------------------------------------\\\\\

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

  useEffect(() => {
    // Call getTime() function to get the current time
    const time = getTime();
    // Update state with the current time
    setChatTime(time);
  }, []);

  //Get Time End


  ////----------------------------------------------------------------------------------------\\\\\  

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
                <p>{chatTime}</p>
                <div className="bot-message" id="message1" ref={botmessage}></div>
                <button onClick={() => handleLinkBtn()} className="bot-message">Click on this button to see something</button>
                <div id="message2" ref={humanMessage}></div>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className="btm">
              <div className="input">
                <input
                  ref={input}
                  type="text"
                  placeholder="Type your message here"
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="mikebtn">
                <button onClick={() => handleMicrophone()}>
                  {microphoneIcon ? <BsMic /> : <BsMicMute />}
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

