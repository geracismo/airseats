import { useContext, useEffect, useState } from "react";
import { AuthContext, ErrorHandlerCtx, disabledModeCtx } from "../contexts";
import { addReqSeats, getReqSeats } from "../utils/localStorage";
import { useLocation, useParams } from "react-router-dom";
import { getAirplane, getSeats } from "../api/airplane-api";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { findNFreeSeats } from "../utils/miscellaneous";
import RequestedSeatsComponent from "./airplane-info";
import { AirplaneRow, RowLabelsComponent, ColLabelsComponent } from "./airplane-seatmap";

function AirplaneComponent(props) {
    const [requestedSeats, setRequestedSeats] = useState([]);
    const [disabledMode, setDisabledMode] = useState(false);

    const { user, setUser } = useContext(AuthContext);
    const { handleEvents } = useContext(ErrorHandlerCtx);

    const location = useLocation();
    const { type } = useParams();

    const occupiedSeats = props.occupiedSeats;

    /** request reload at every page change */
    useEffect(() => {
        props.setDirty(true);
    }, [location.pathname])

    /** whenever logout is performed clean requested seats for guest view */
    useEffect(() => {
        if (!user)
            setRequestedSeats([]);
    }, [user])

    /** request specification about selected airplane and its occupied seats */
    useEffect(() => {
        const fetch = async () => {
            const airplaneSpec = await getAirplane(type);
            props.setAirplaneSpec(airplaneSpec);
            const lcOccSeats = await getSeats(airplaneSpec.id);

            props.setOccupiedSeats(lcOccSeats);
            props.setDirty(false);
        }
        try {
            if (props.dirty)
                fetch();
        } catch (error) {
            handleEvents({type: 'error', message: error.message})
        }


        /** if page loading is complete import requested seats from local storage */
        if (!props.dirty)
            setRequestedSeats(getReqSeats(props.airplaneSpec.type));
    }, [props.dirty])


    /** when we request a seats, non in random mode, put it also in localStorage */
    useEffect(() => {
        if (!disabledMode)
            addReqSeats(props.airplaneSpec.type, requestedSeats);
    }, [requestedSeats]);


    return (
        <disabledModeCtx.Provider value={{ disabledMode: disabledMode, setDisabledMode: setDisabledMode }}>
            <Container className="mt-3 mb-5 pb-5">
                <Row>
                    <Col className="d-flex justify-content-center pb-4">
                        <span className="fs-1 fw-bold">{props.airplaneSpec.type}</span>
                    </Col>
                </Row>
                <Row>
                    <Col xs={user ? 7 : 12}>
                        <SeatMapComponent airplaneSpec={props.airplaneSpec} setRequestedSeats={setRequestedSeats} occupiedSeats={occupiedSeats} requestedSeats={requestedSeats} dirty={props.dirty} />
                    </Col>
                    {user && (<Col xs={5}>
                        <AirTravelInfoComponent requestedSeats={requestedSeats} setRequestedSeats={setRequestedSeats} airplaneConfig={props.airplaneSpec} occupiedSeats={occupiedSeats} setOccupiedSeats={props.setOccupiedSeats} setDirty={props.setDirty} dirty={props.dirty} />
                    </Col>)}
                </Row>
            </Container>
        </disabledModeCtx.Provider>
    )
}


function SeatMapComponent(props) {
    const rows = props.airplaneSpec.rows;
    const cols = props.airplaneSpec.cols;
    const occupiedSeats = props.occupiedSeats;

    const { user } = useContext(AuthContext);
    const { disabledMode } = useContext(disabledModeCtx);

    const components = [];

    for (let index = 0; index < rows; index++) {
        const occupiedSeatsPerRow = occupiedSeats.filter(seat => seat.seat_row === index);
        components.push(
            <Row xs="auto" className="mb-2  airplane-row justify-content-center">
                <AirplaneRow key={index} cols={cols} row={index} setRequestedSeats={props.setRequestedSeats} requestedSeats={props.requestedSeats} occupiedSeats={occupiedSeatsPerRow} dirty={props.dirty} />
            </Row>
        )
    };

    const seatMap = (<Container> {...components} </Container>);

    return (
        <Container className={disabledMode ? " opacity-50" : ''}>
            <Row xs="auto" className="mb-2 justify-content-center airplane-row">
                <ColLabelsComponent cols={cols} />
            </Row>
            <Row className="d-flex justify-content-center">
                <Col xs={2} className="p-0"><RowLabelsComponent rows={rows} /></Col>
                <Col xs={!user ? 2 : 4} className="p-0">{seatMap}</Col>
                <Col xs={2} className="p-0"><RowLabelsComponent rows={rows} /></Col>
            </Row>
        </Container>
    )
}

function AirTravelInfoComponent(props) {

    const [randomSeatsNumber, setRandomSeatsNumber] = useState(0);
    const [random, setRandom] = useState(false);
    const { user, userId } = useContext(AuthContext);
    const { setDisabledMode } = useContext(disabledModeCtx);

    /** random seats request calculation */
    const onRandomSubmit = (e) => {
        e.preventDefault();

        const candidateSeats = findNFreeSeats(randomSeatsNumber, props.occupiedSeats, props.airplaneConfig);
        props.setRequestedSeats(candidateSeats);
    }

    /** flag indicating if random mode toggle should be enabled or not, based on situation */
    const randomShouldBeDisabled = () => {
        const thereIsAtLeastOneMine = () => {
            return props.occupiedSeats.filter(seat => seat.user_id === userId).length > 0;
        }
        const airplaneIsTotallyFree = () => {
            return props.occupiedSeats.length === 0;
        }

        return (thereIsAtLeastOneMine() && !airplaneIsTotallyFree()) || (thereIsAtLeastOneMine() && airplaneIsTotallyFree());
    }

    return (
        <Container className="h-100">
            <Row className="h-auto">
                <Col className="fw-bold fs-4">
                    <span>
                        Welcome {user.toUpperCase()} in AirSeat!
                    </span>
                </Col>
            </Row>
            <Row className="mb-4 mt-2 h-auto">
                <Col className="mt-2">
                    <span className="fw-normal fs-4 badge bg-warning text-wrap w-75 p-2">
                        Up to 50% more expensive later
                    </span>
                </Col>
            </Row>
            <Row className="mb-4 h-auto">
                <Col className="mt-2">
                    <Form onSubmit={(e) => onRandomSubmit(e)}>
                        <Form.Check className="fs-5 fw-bold"
                            type="switch"
                            id="custom-switch"
                            label="Random assignments"
                            value={random}
                            disabled={randomShouldBeDisabled()}
                            onChange={(e) => {
                                setRandom(!random);
                                props.setRequestedSeats([]);
                                setDisabledMode(random);
                            }}
                        />
                        <Row>
                            <Col xs={5}>
                                <Form.Control className="w-auto"
                                    size="xs"
                                    type="number"
                                    placeholder="Seat quantity"
                                    disabled={randomShouldBeDisabled()}
                                    onChange={(e) => setRandomSeatsNumber(parseInt(e.target.value))}
                                />
                            </Col>
                            <Col>
                                <Button
                                    className='color-secondary'
                                    disabled={randomShouldBeDisabled()}
                                    type="submit">
                                    <span>OK</span>
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row className="h-auto w-75">
                <Col>
                    <RequestedSeatsComponent requestedSeats={props.requestedSeats} setRequestedSeats={props.setRequestedSeats} occupiedSeats={props.occupiedSeats} setDirty={props.setDirty} dirty={props.dirty} airplaneId={props.airplaneConfig.id} />
                </Col>
            </Row>
        </Container>
    )
}

export default AirplaneComponent;