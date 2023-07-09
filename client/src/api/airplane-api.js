const APIURL = 'http://localhost:3000';

/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

          // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
          response.json()
            .then(json => resolve(json))
            .catch(err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyzing the cause of error
          response.json()
            .then(obj =>
              reject({...obj, code: response.status})
            ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err =>
        reject({ error: "Cannot communicate" })
      ) // connection error
  });
}

async function getGuess() {

  try {
    const response = await fetch(APIURL + '/api/guess', { credentials: "include" });
    if (response.ok) {
      const n = await response.text();
      return Number(n);
    } else
      throw new Error();
  } catch (e) {
    throw new Error(e);
  }
}

const getAirplane = async (type) => {
  return getJson(fetch(APIURL + `/api/airplanes/${type}`, { credentials: "include" }))
    .then(response => {

      const airplane = {
        id: response.airplane.airplane_id,
        type: response.airplane.airplane_type,
        rows: response.airplane.n_rows,
        cols: response.airplane.n_cols,
      }

      return airplane;
    })
}

const getSeats = async (airplaneId) => {
  return getJson(fetch(APIURL + `/api/airplanes/${airplaneId}/seats`, { credentials: "include" }))
    .then(response => {
      if (response.seats)
        return response.seats;
    })
}

const postSeats = async (airplaneId, requestedSeats) => {
  const seats = requestedSeats.map((seat) => { return { row: seat.seatRow, col: seat.seatCol } });

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seats: [...seats] }),
    credentials: "include"
  };
  
  return getJson(fetch(APIURL + `/api/airplanes/${airplaneId}/seats`, requestOptions))
    .then(response => {
      if (response.seats)
        return response.seats;

    })
    .catch(err => {
       return err;
    })
}


const deleteBooking = async (airplaneId) => {
  try {
    const requestOptions = {
      method: 'DELETE',
      credentials: "include"
    };

    const response = await fetch(APIURL + `/api/airplanes/${airplaneId}/seats`, requestOptions);

    if (response.ok) {
      return undefined;
    } else
      throw {type: 'error', message: "Error during deletion."};
  } catch (e) {
    throw {type: 'error', message: e.message};;
  }
}



export { getGuess, getAirplane, getJson, getSeats, postSeats, deleteBooking };