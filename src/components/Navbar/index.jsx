import { useContext } from "react"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { AuthContext } from "../../context/AuthContext"
import Notification from "../Chat/Notification"

function NavBar(){
  const { user ,logoutUser} = useContext(AuthContext)

    return(<div>
         <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Chat App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
     
        <Navbar.Collapse id="basic-navbar-nav">
        <span className="text-warning">Loggin as {user?.user_name}</span>

        </Navbar.Collapse>
        <Navbar.Collapse id="basic-navbar-nav">
          {user?<Nav className="me-auto">
            <Notification/>
            <Nav.Link onClick={logoutUser} href="/login">logout</Nav.Link>
         
          </Nav>:<Nav className="me-auto">
            <Nav.Link href="/login">Login</Nav.Link>
         
          </Nav>}
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>)
}
export default NavBar