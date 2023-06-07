import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    console.log(password);

    // reset fields
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
  );
}

export default Login;
