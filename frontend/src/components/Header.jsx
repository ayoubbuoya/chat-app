import { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Form,
  FormControl,
  Modal,
  Card,
} from "react-bootstrap";
import axios from "axios";

const Header = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const API_URL = "http://127.0.0.1:8000/api";

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

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `${API_URL}/user/search/?query=${query}`
      );
      const searchData = response.data;
      setSearchResults(searchData);
      setShowModal(true);
      console.log("Search results:", searchData);
    } catch (error) {
      console.error("Search Error : ", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <header className="d-flex justify-content-between">
      <div className="logo-container bg-light">
        <a href="/">Messenger</a>
      </div>
      <Form inline className="d-flex w-50" onSubmit={handleSearch}>
        <FormControl
          type="text"
          placeholder="Search"
          className="me-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="outline-primary" className="h-10 w-30" type="submit">
          Search
        </Button>
      </Form>
      {/* <form action="">
        <input type="text" placeholder="Search" className="me-2" />
        <button className="btn btn-primary">Search</button>
      </form> */}
      <Navbar bg="light" variant="light">
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="Profile" id="profile-dropdown" alignRight>
              <NavDropdown.Item href={`/profile/${currentUser.id}`}>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="#">Settings</NavDropdown.Item>
              <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/">Conversations</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Search Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {searchResults.map((result) => (
            <a href={`/profile/${result.id}`} key={result.id}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>{result.name}</Card.Title>
                  <Card.Text>{result.username}</Card.Text>
                </Card.Body>
              </Card>
            </a>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </header>
  );
};

export default Header;
