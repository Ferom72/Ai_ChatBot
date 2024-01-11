import React, { useState, useRef } from "react";
import { CiPaperplane } from "react-icons/ci";
import "./Index.css";

const APIKey = "";

function Index() {
  const [userText, setUserText] = useState({
    text: "",
    type: "user",
  });

  const [chatLog, setChatLog] = useState([
    { role: "bot", content: "Welcome to ChatBot! any questions?" },
  ]);

  const [isThinking, setIsThinking] = useState(false);

  const chatLogRef = useRef(null);

  const [selectedStyle, setSelectedStyle] = useState("Motivational");

  async function makeCall(text) {
    setIsThinking(true);

    const API = "https://api.openai.com/v1/chat/completions";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${APIKey}`,
      },
      body: JSON.stringify({
        messages: [{ role: "system", content: text }],
        model: "gpt-3.5-turbo",
      }),
    };

    try {
      const res = await fetch(API, requestOptions);
      const openAiRes = await res.json();
      const aiText = openAiRes.choices[0].message.content;

      const serverURL = "http://localhost:3001";
      const response = await fetch(`${serverURL}/api/style`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response: aiText,
          styleTokens: [],
          selectedStyle,
        }),
      });
      const data = await response.json();

      return data.styledResponse;
    } catch (error) {
      console.log("error", error);
      return "";
    } finally {
      setIsThinking(false);
    }
  }

  async function handleForm(event) {
    event.preventDefault();
    setUserText({
      text: "",
      type: "user",
    });
    const newText = event.target.querySelector(".user-input").value;

    const newChatLog = [...chatLog, { role: "user", content: newText }];
    setChatLog(newChatLog);

    setIsThinking(true);

    const responseData = await makeCall(newText);
    const updatedChatLog = [
      ...newChatLog,
      { role: "bot", content: responseData },
    ];

    setTimeout(() => {
      setChatLog(updatedChatLog);
      setIsThinking(false);
    }, 500);
  }

  return (
    <div>
      <div className="chatBot__Container">
        <div>
          <h1>ChatBot</h1>
          <div>
            <label>Type of Speaker:</label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}>
              <option value="Motivational">Motivational</option>
              <option value="Formal">Formal</option>
              <option value="Casual">Casual</option>
              <option value="Humorous">Humorous</option>
              <option value="Academic">Academic</option>
              <option value="Poetic">Poetic</option>
            </select>
          </div>
        </div>
        <div className="chat__log" ref={chatLogRef}>
          {chatLog.map((message, index) => (
            <p key={index} className={`message ${message.role}`}>
              {message.content}
            </p>
          ))}
          {isThinking && <p className="message bot">Thinking...</p>}
        </div>

        <form onSubmit={handleForm} className="form-container">
          <div className="textarea__container">
            <textarea
              className="user-input"
              placeholder="Chat here"
              value={userText.text}
              onChange={(e) =>
                setUserText({ text: e.target.value, type: "user" })
              }
            />
          </div>
          <div className="button__container">
            <button className="submit__button" type="submit">
              <div className="send__text">Send</div>
              <div className="plane__container">
                <CiPaperplane className="plane" size={20} />
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Index;
