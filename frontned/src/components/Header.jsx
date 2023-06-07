import { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";

const MessengerHeader = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Set the initial state of the expanded property
    setIsExpanded(false);
  }, []);

  const handleExpand = () => {
    // Toggle the expanded property
    setIsExpanded(!isExpanded);
  };

  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand href="/">Messenger</Navbar.Brand>
      <Nav className="ml-auto">
        <Nav.Item>
          <Button variant="primary" onClick={handleExpand}>
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </Nav.Item>
        <NavDropdown title="Profile" id="profile-dropdown">
          <NavDropdown.Item href="#">Profile</NavDropdown.Item>
          <NavDropdown.Item href="#">Settings</NavDropdown.Item>
          <NavDropdown.Item href="#">Logout</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
};

export default MessengerHeader;
