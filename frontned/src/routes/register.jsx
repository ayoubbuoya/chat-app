import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name);
    console.log(email);
    console.log(password);

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
