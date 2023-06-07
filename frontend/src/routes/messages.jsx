import { Navigate, useNavigate, useParams } from "react-router-dom";
import Header from "./../components/Header";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

function Messages() {
  const isLoggedIn = localStorage.getItem("token");
  const { id } = useParams();
  const API_URL = "http://127.0.0.1:8000/api";
  const [currentUser, setCurrentUser] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const messagesContainerRef = useRef(null);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/detail`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch Messages
  useEffect(() => {
    axios
      .get(`${API_URL}/user/conversations/${id}/messages`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setMessages(response.data);

      })
      .catch((error) => {
        console.error("Error fetching messages :", error);
      });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    axios
      .post(
        `${API_URL}/user/conversations/${id}/send/`,
        { content: newMessage },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        const newMessage = response.data;
        newMessage["sender_name"] = currentUser.name;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setNewMessage("");
        scrollToBottom();
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    container.scrollTop = container.scrollHeight - container.clientHeight;
  };

  return isLoggedIn ? (
    <>
      <Header></Header>
      <div className="chat-container mt-4" >
        <div className="messages-container" ref={messagesContainerRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.sender === currentUser.id
                  ? "sent-message"
                  : "received-message"
              }`}
            >
              <span>{message.sender_name}</span>
              <p>{message.content}</p>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage(e);
              }
            }}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </>
  ) : (
    <Navigate to="/login" />
  );
}

export default Messages;
