import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { DefaultLayout } from './components/layout';
import LoginComponent from './components/login';
import AirplaneComponent from './components/airplane';
import { Stack } from 'react-bootstrap';
import { ErrorHandlerCtx } from './contexts';

function App() {

  const [airplaneSpec, setAirplaneSpec] = useState({});
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);


  const handleEvents = (event) => {
    let msg = '';
    msg = event.message;
    if (event.type === 'error')
      setError(msg);
    else
      setMessage(msg);
  }

  const airplaneFilter = {
    'local': { url: '/airplanes/local' },
    'regional': { url: '/airplanes/regional' },
    'international': { url: '/airplanes/international' }
  };


  return (
    <BrowserRouter>
      <ErrorHandlerCtx.Provider value={{ handleEvents: handleEvents }}>
        <Stack className="p-0 App h-100">
          <Routes>
            <Route exact path='/' element={<DefaultLayout error={error} message={message} setError={setError} setMessage={setMessage} filters={airplaneFilter} />}>
              <Route path='login' element={<LoginComponent />} />
              <Route path='/airplanes/:type' element={<AirplaneComponent airplaneSpec={airplaneSpec} setAirplaneSpec={setAirplaneSpec} dirty={dirty} setDirty={setDirty} occupiedSeats={occupiedSeats} setOccupiedSeats={setOccupiedSeats} />}></Route>
            </Route>
          </Routes>
        </Stack>
      </ErrorHandlerCtx.Provider>
    </BrowserRouter>

  )
}

export default App
