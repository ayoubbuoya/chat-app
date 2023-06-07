import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const API_URL = "http://127.0.0.1:8000/api";
  let navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the API using the user's ID
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/profile/${id}`);
        setUser(response.data);
        checkIfFriend(response.data.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [id]);

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

  const checkIfFriend = async (userId) => {
    try {
      if (!currentUser) {
        // currentUser state is not available yet
        return;
      }

      // Fetch conversations
      const conversations = await axios.get(`${API_URL}/user/conversations/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      const responseData = conversations.data;
      for (const conversation of responseData) {
        conversation.participants.map((participant) => {
          if (
            (participant.id == userId && participant.id != currentUser.id) ||
            participant.id == currentUser.id
          ) {
            console.log("part : ", participant.id, "user : ", userId);
            setIsFriend(true);
          }
        });
      }

      // User is not a friend
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const alreadyFriend = () => {
    console.log("already friends");
  };

  const addFriend = async () => {
    try {
      const data = {
        id: id,
      };

      await axios.post(`${API_URL}/user/conversations/create/`, data, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      alert("Succesfully Added ");
      // Redirect to the conversations page
      navigate("/");
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const buttonLabel = isFriend ? "Already a Friend" : "Add Friend";
  const btnClick = isFriend ? alreadyFriend : addFriend;

  return user ? (
    <>
      <Header></Header>
      <div className="profile-container mt-5 text-center">
        <h2>Profile: {user.name}</h2>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <button
          onClick={btnClick}
          className="btn btn-secondary"
          style={{ fontSize: "1.2rem", fontWeight: 500 }}
        >
          {buttonLabel}
        </button>
      </div>
    </>
  ) : (
    <div>Loading...</div>
  );
}

export default Profile;
