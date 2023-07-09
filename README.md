[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/Ij4wZ9xX)
# Exam #12345: "Exam Title"

## Student: s316379 GERACI SIMONE

# Server side

## API Server

- POST `/api/login`
  - req.body: {username: string, password: string}
  - res.body: {"user":{"username": username ,"userId": userId}}
- GET `/api/logout`
  - perform logout
  - destroy the session obj
  - send an http 200 response if gone well. 500 otherwise
- POST `/api/register`
  - create a new user
  - req.body: {username: string, password: string}
  - send an http 200 response if gone well. 500 otherwise
- GET `airplanes/:type`
  - get airplane's specification
  - req.params.type: `local`/`regional`/`international`
  - authentication not needed
  - res.body: 
    {
    "airplane": {
        "airplane_id": 1,
        "airplane_type": "local",
        "n_rows": 15,
        "n_cols": 4
    }
}
- POST `/airplanes/:airplaneId/seats`
  - create a new reservation for the user
  - body request: 
[{row: 6, col: 2}, {row: 7, col: 2}, {row: 8, col: 2}]
  - req.params.airplaneId: integer
  - need authentication
  - check if in db there is other reservations in the same seats and then perform the post. In case of already reserved seats send them as reply.
- DELETE `/airplanes/:airplaneId/seats`
  - delete the user reservation
  - req.params.airplaneId: integer
  - need authentication
  - perform a delete in db
- GET `/airplanes/:airplaneId/seats`
  - get all airplane's occupied seats
  - req.params.airplaneId: integer
  - authentication not needed

## Database Tables

- Table `seat` - (seat_id, user_id, airplane_id, seat_row, seat_col) - contains reserved seats of all airplanes
- Table `airplane` - (airplane_id, airplane_type, n_rows, n_cols) - contains the three types of airplane, with their specification
- Table `user` - (user_id, username, hshd_psw, salt) - contains all user

## React Client Application Routes
- http://localhost:5173/login - form to perform login
- http://localhost:5173/ - empty page, can be see as homepage
- http://localhost:5173/airplanes/:type - allows to navigate through each airplane and each seat-map, if user is a guest only the seatmap is visible, if he's logged, also the requested seat/own seat table is visible. 


## Main React Components
- `App` (in `App.jsx`): root component, contains airplane specification and occupied seats states, dirty obj and error handling function. Furthermore define the route in the application
- `DefaultLayout` (in `layout.jsx`): represents the layout, so mainly the header of the app, contains the logic under the logout call and the first auth fetch. 
- `LoginComponent` (in `login.jsx`): usend in login page, it is responsible of the login logic operation.
- `AirplaneComponent` (in `airplane.jsx`): perform data fetch for the selected airplane and own the requested seats
- `SeatMapComponent` (in `airplane.jsx`): represent the seat map of each airplane, it's the bridge that connects all seat component.
  - `AirplaneRow` (in `airplane-seatmap.jsx`): represent of row of the seatmap
    - `AirplaneSeat` (in `airplane-seat.jsx`): represent the seat component, manage its status, comunication with app and airplane component in order to comunicate to everyone his change state.
- `AirTravelInfoComponent` (in `airplane.jsx`): contains a table for own reserved/requested seats. It's also responsible for the random chose of the requested seats. 
  - `RequestedSeatsComponent` (in `requested-seats.jsx`): inside `AirTravelInfoComponent`, represent truly the table described up, contains logic to perform a reservation/deletion of a seat.
      - `RequestedSeatsComponent` (in `requested-seats.jsx`): differenciate the input from up component in order to customize the graphics

(only _main_ components, minor ones may be skipped)

# Usage info
Use localStorage to remember username usedbefore the last closure of the webapp and use it to perform an auth fetch and check if the session is still valid. Despite we have also the session id in the cookie storage, I opted to local storage in order to show the username also in the case the session is expired, in the next call 

## Example Screenshot

![Screenshot](./client/src/assets/Screenshot%20from%202023-07-09%2023-52-04.png)

## Users Credentials

- geracismo, geracismo
- carazzomatarola, carazzomatarola
- tametsi, tametsi - empty
- admin, admin - empty
