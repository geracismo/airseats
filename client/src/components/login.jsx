import { useContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth-api';
import { AuthContext, ErrorHandlerCtx } from '../contexts';
import { addUserInfo } from '../utils/localStorage';

function LoginComponent(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const authContext = useContext(AuthContext);
  const { handleEvents } = useContext(ErrorHandlerCtx);

  const navigate = useNavigate();

  const performLogin = async (credentials) => {
    const response = await login(credentials);
    authContext.setUser(response.user.username);
    authContext.setUserId(response.user.userId);
    addUserInfo(response.user.username, response.user.userId);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username && password) {
      try {
        await performLogin({ username: username.trim(), password: password.trim() });
        handleEvents({type: 'info', message: "Login succeed."});
        navigate('/airplanes/local');
      } catch (error) {
        handleEvents({type: 'error', message: error.message});
      }
    }
  }


  return (
    <Container className='w-25 login-form border border-2 rounded'>
      <Form className='d-flex flex-column ' onSubmit={handleSubmit}>
        <span className='login-label mt-3 fs-2 fw-lighter'>
          Login
        </span>
        <span className='mb-3'>
          Sign in to view and manage your account and bookings
        </span>
        <Form.Group className="mb-2 fw-bold" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" required={true} value={username} onChange={event => setUsername(event.target.value)} />
        </Form.Group>

        <Form.Group className="mb-4 mt-3 fw-bold" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" required={true} value={password} onChange={event => setPassword(event.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit" className='mb-3'>
          Submit
        </Button>
      </Form>
    </Container>
  );
}

export default LoginComponent;