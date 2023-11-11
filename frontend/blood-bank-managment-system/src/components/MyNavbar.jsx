import React, {useState} from 'react'
import { Navbar, Container, Button, NavDropdown, Nav } from 'react-bootstrap'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import SearchModal from './SearchModal'

export default function MyNavbar() {
  const navigate = useNavigate()
  const [showSearch, setSearch] = useState(false)

  function toggleModal(){
    setSearch(!showSearch)
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
          <Container fluid>
            <Navbar.Brand>BLOOD BANK MANAGMENT SYSTEM</Navbar.Brand>
        
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
            <NavDropdown title="Options" id="navbarScrollingDropdown">
                <NavDropdown.Item onClick={toggleModal}>Search</NavDropdown.Item>
                <NavDropdown.Item onClick={()=>{
                  Cookies.remove('login')
                  navigate('/')
                }}> Log Out</NavDropdown.Item>
              </NavDropdown>
              </Nav>

            {/* <Button variant='outline-light' onClick={()=>{
              Cookies.remove('login')
              navigate('/')
            }}>Log Out</Button> */}
          </Container>
        </Navbar>
        <SearchModal show={showSearch} onHide={setSearch}/>
    </>
  )
}
