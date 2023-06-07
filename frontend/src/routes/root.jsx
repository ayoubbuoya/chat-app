import { Navigate } from "react-router-dom";
import Conversations from "../components/Conversations";
import Header from "../components/Header";

function Root() {
  const isLoggedIn = localStorage.getItem("token");

  return isLoggedIn ? (
    <>
      <Header></Header>
      <Conversations />
    </>
  ) : (
    <Navigate to="/login" />
  );
}

export default Root;
