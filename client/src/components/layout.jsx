import { Col, Container, Navbar, Row, Nav, Button, Dropdown, DropdownButton, Spinner } from "react-bootstrap"
import { ReactComponent as AirplaneLogo } from "../assets/plane-icon.svg";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext, ErrorHandlerCtx, disabledModeCtx } from "../contexts";
import { deleteUserInfo, wasILoggedIn } from "../utils/localStorage";
import { checkAuth, logout } from "../api/auth-api";
import { NotificationToast } from "./toast";

export function DefaultLayout(props) {
    const [user, setUser] = useState(false);
    const [userId, setUserId] = useState(false);
    const navigate = useNavigate();
    const { handleEvents } = useContext(ErrorHandlerCtx);

    /** Trying to understand if this client was previously authenticated analyzing local storage
     *  If data is present in lS, use it to make an auth request to test the session
     *  If session is expired navigate to login page, continue application build otherwise
     */
    useEffect(() => {
        loginFetch();
    }, [])

    const loginFetch = async () => {
        const { username, id } = wasILoggedIn();
        if (username && id) {
            try {
                const authVerdict = await checkAuth();
                if (authVerdict.status === 200) {
                    setUser(username);
                    setUserId(parseInt(id));
                } else {
                    deleteUserInfo();
                    navigate('/login');
                }
            } catch (e) {
                handleEvents({ type: 'error', message: e.message })
            }
        } else {
            setUser(false);
        }
    }

    const performLogout = async (event) => {
        event.preventDefault();

        try {
            await logout();
        } catch (e) {
            handleEvents({ type: 'error', message: e.message })
        } finally {
            setUser(false);
            deleteUserInfo();
        }
    }

    const navigateLogin = (e) => {
        e.preventDefault();
        navigate('/login');
    }

    return (user || user === false) && (
        <AuthContext.Provider value={{ user, setUser, userId, setUserId }}>
            <Container fluid className="p-0 d-flex flex-column header">
                <Row >
                    <Col>
                        <Navbar>
                            <Container>
                                <Navbar.Brand className="ps-5 d-flex align-items-center">
                                    <AirplaneLogo />{' '}
                                    <span className="ms-4 fs-2 fw-bold">
                                        AirSeats
                                    </span>
                                </Navbar.Brand>
                            </Container>
                        </Navbar>
                    </Col>
                    <Col className="header justify-content-end align-content-center d-grid pe-5">
                        <DropdownButton size="lg" title="" className="color-primary" hidden={!user}>
                            <Dropdown.Item onClick={(e) => performLogout(e)}>logout</Dropdown.Item>
                        </DropdownButton>
                        <Button size="lg" className="color-primary" hidden={user}>
                            <Dropdown.Item onClick={(e) => navigateLogin(e)}>login</Dropdown.Item>
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col >
                        <ASNavBar filters={props.filters} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Outlet className="p-0 main" />
                    </Col>
                </Row>
                <Row>
                    <NotificationToast error={props.error} message={props.message} setMessage={props.setMessage} setError={props.setError} />
                </Row>
            </Container>
        </AuthContext.Provider>
    )
}

export function ASNavBar(props) {
    const airplanesArray = Object.entries(props.filters);

    return (
        <Nav variant="underline" className="ps-3 fs-5" defaultActiveKey="/sirseats/">
            {airplanesArray.map(([airplane, { url }]) =>
                <Nav.Item className="ps-5" key={airplane}>
                    <NavLink to={url}>{airplane.toUpperCase()}</NavLink>
                </Nav.Item>
            )}
        </Nav>
    )
}