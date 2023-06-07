import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Root() {
  let navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 1);
  }, []);

//   return (
//     <>
//       <a href="/login">Login</a>
//     </>
//   );
}

export default Root;
