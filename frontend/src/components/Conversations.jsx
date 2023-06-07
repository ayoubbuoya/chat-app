import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import axios from "axios";

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const API_URL = "http://127.0.0.1:8000/api";
  const token = localStorage.getItem("token");

  // Fetch current user data from API
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

  // Fetch conversations data from API
  useEffect(() => {
    axios
      .get(`${API_URL}/user/conversations`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setConversations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching conversations:", error);
      });
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  
  return (
    <>
      <h2 className="text-center m-5">Conversations</h2>
      <Card className="m-6">
        <ListGroup variant="flush" className="">
          {conversations.map((conversation) => (
            <a href={`/messages/${conversation.id}`} key={conversation.id}>
              <ListGroup.Item key={conversation.id}>
                <div className="other-user">
                  <h4>
                    {conversation.participants[0].id == currentUser.id
                      ? conversation.participants[1].name
                      : conversation.participants[0].name}
                  </h4>
                </div>
              </ListGroup.Item>
            </a>
          ))}
        </ListGroup>
      </Card>
    </>
  );
};

export default Conversations;
