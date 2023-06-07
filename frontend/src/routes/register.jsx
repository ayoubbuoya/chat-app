import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Register() {
  const API_URL = "http://127.0.0.1:8000/api";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(name);
    console.log(email);
    console.log(password);

    try {
      const response = await axios.post(`${API_URL}/user/register/`, {
        email: email,
        name: name,
        password: password,
      });

      console.log(response.data);
      alert("Success");
      navigate("/login");
    } catch (err) {
      console.error(err.response.data);
    }

    // reset fields
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <Container className="login-container">
      <Row>
        <Col>
          <div className="login-header">
            <h1>Messenger</h1>
          </div>
          <div className="login-content">
            <h2>Create a New Account</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  onChange={handleNameChange}
                />
              </Form.Group>

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
                Create Account
              </Button>
            </Form>
            <div className="login-footer">
              <a href="/login">
                <p>Already have an account?</p>
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
