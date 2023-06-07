import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";

function Login() {
  let navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");
  const API_URL = "http://127.0.0.1:8000/api";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email);
    console.log(password);

    try {
      const response = await axios.post(`${API_URL}/user/login/`, {
        email: email,
        password: password,
      });
      
      console.log(response.data);
      // Handle the successful login response
      handleLoginSuccess(response.data.token);
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.error);
    }

    // reset fields
    setEmail("");
    setPassword("");
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    alert("Login Success");
    navigate("/");
  };

  return !isLoggedIn ? (
    <Container className="login-container">
      <Row>
        <Col>
          <div className="login-header">
            <h1>Messenger</h1>
          </div>
          <div className="login-content">
            <h2>Log in to Messenger</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="form-gr">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={handleEmailChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="form-gr">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={handlePasswordChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="log-btn">
                Log In
              </Button>
            </Form>
            <div className="login-footer">
              <a href="#">
                <p>Forgot password?</p>
              </a>
              <a href="/register">
                {" "}
                <p>Create new account</p>
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  ) : (
    <Navigate to="/" />
  );
}

export default Login;
