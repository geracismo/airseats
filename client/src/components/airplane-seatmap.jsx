import { Col, Container, Row } from "react-bootstrap";
import AirplaneSeat from "./airplane-seat";
import { numberToLetterIndex } from "../utils/miscellaneous";


function AirplaneRow(props) {
    const components = [];

    for (let index = 0; index < props.cols; index++) {
        components.push(
            <Col key={index} className={`p-1 ${index % props.cols / (Math.round(props.cols / 2 - 1)) === 1 ? `pe-4` : ''}`}>
                <AirplaneSeat row={props.row} col={index} setRequestedSeats={props.setRequestedSeats} occupiedSeats={props.occupiedSeats} requestedSeats={props.requestedSeats} dirty={props.dirty} />
            </Col>
        )
    };

    return components;
}

function RowLabelsComponent(props) {
    const components = [];
    for (let index = 0; index < props.rows; index++) {
        components.push(
            <Row key={index} xs="auto" className="mb-2 justify-content-center row-label align-items-center fw-bold">
                <Col>{index}</Col>
            </Row>
        )
    };

    return (<Container>{...components}</Container>);
}

function ColLabelsComponent(props) {
    const components = [];
    const cols = props.cols;

    for (let index = 0; index < props.cols; index++) {
        components.push(
            <Col key={index} className={`p-1 ${index % cols / (Math.round(cols / 2 - 1)) === 1 ? `pe-4` : ''}`}>
                <span className='col-label d-block text-center fw-bold'>
                    {numberToLetterIndex(index)}
                </span>
            </Col>
        )
    };

    return (components);
}

export { AirplaneRow, ColLabelsComponent, RowLabelsComponent };