import { Button, Col, Container, Row } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { AuthContext, ErrorHandlerCtx, disabledModeCtx } from "../contexts";
import { deleteBooking, postSeats } from "../api/airplane-api";
import { numberToLetterIndex } from "../utils/miscellaneous";
import { useNavigate } from "react-router-dom";


function RequestedSeatsComponent(props) {
    const { userId, setUser } = useContext(AuthContext);
    const [mineSeats, setMineSeats] = useState([]);
    const { handleEvents } = useContext(ErrorHandlerCtx);
    const { disabledMode, setDisabledMode } = useContext(disabledModeCtx);
    const navigate = useNavigate();

    /** find own seats  */
    useEffect(() => {
        if (!props.dirty) {
            const mine = props.occupiedSeats.filter((seat) => seat.user_id === userId);
            setMineSeats(mine);

            if (mine.length > 0)
                setDisabledMode(true);
            else
                setDisabledMode(false);
        }
    }, [props.dirty]);

    const performDelete = async (e) => {
        e.preventDefault();

        try {
            await deleteBooking(props.airplaneId);
            props.setDirty(true);
            handleEvents({ type: 'info', message: 'Deletion success' });
        } catch (error) {
            handleEvents({ type: 'error', message: error.message });
        }
    }

    const performBooking = async () => {
        try {
            const response = await postSeats(props.airplaneId, props.requestedSeats);
            if (!response.message) {
                if (response.rowsAlreadyReserved) {
                    const seatsAlredyOccupied = response.rowsAlreadyReserved.map((row) => { return (`${row.seat_row}/${numberToLetterIndex(row.seat_col)} `) });
                    handleEvents({ type: 'error', message: `You requested some seats that are just be occupied: ${seatsAlredyOccupied}` });
                } else {
                    handleEvents({ type: 'info', message: `Book successful` });
                }
            } else {
                if(response.code && response.code === 401) {
                    setUser(false);
                    navigate('/login');
                }
                    
                handleEvents({ type: 'error', message: response.message });
            }


        } catch (error) {
            handleEvents({ type: 'error', message: error.message });
        } finally {
            props.setDirty(true);
            props.setRequestedSeats([]);
        }

    }

    return (
        <Container className="h-auto">
            <Row className="border">
                <Col xs={10} className="d-grid align-content-center fw-bold fs-4">
                    <span>{mineSeats.length > 0 ? 'BOOKED SEATS' : 'REQUESTED SEATS'}</span>
                </Col>
                {mineSeats.length > 0 ?
                    <Col xs={2} className="p-1">
                        <Button className="delete-button" onClick={performDelete}> X </Button>
                    </Col> :
                    <Col xs={2} className="p-1">
                        <Button className="book-button" onClick={performBooking}>v</Button>
                    </Col>
                }
            </Row>

            <SeatsTableComponent requestedSeats={props.requestedSeats} mineSeats={mineSeats} />
        </Container>
    )

}


function SeatsTableComponent(props) {
    const [seatsInTable, setSeatInTable] = useState([]);

    useEffect(() => {
        if (props.mineSeats.length > 0)
            setSeatInTable(props.mineSeats.map(seat => { return { seatRow: seat.seat_row, seatCol: seat.seat_col, seatId: seat.seat_id } }));
        else
            setSeatInTable(props.requestedSeats);
    }, [props.mineSeats, props.requestedSeats])

    const components = [];
    for (let index = 0; index < seatsInTable.length; index++) {
        components.push(
            <Row key={index}>
                <Col className={`${props.mineSeats.length > 0 ? 'bok-seat-row' : 'req-seat-row'} pt-4 pb-4`}>
                    <RequestedSeatsTableRowComponent seatRow={seatsInTable[index].seatRow} seatCol={seatsInTable[index].seatCol} />
                </Col>
            </Row>
        )
    };

    return components;
}


function RequestedSeatsTableRowComponent(props) {

    return (
        <Container className="h-100">
            <Row className="h-100">
                <Col xs={3} className="d-grid align-content-center">
                    <div className="border border-primary rounded-circle icon-req-seats-table align-content-center justify-content-center d-grid">
                        <span className="fw-bold">
                            SM
                        </span>
                    </div>
                </Col>
                <Col className="d-grid align-content-center">
                    <span>Row: {props.seatRow}</span>
                    <span>Col: {numberToLetterIndex(props.seatCol)}</span>
                </Col>
            </Row>
        </Container>
    )
}

export default RequestedSeatsComponent;