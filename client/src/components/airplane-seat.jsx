import { useContext, useEffect, useState } from "react";
import { AuthContext, disabledModeCtx } from "../contexts";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { numberToLetterIndex } from "../utils/miscellaneous";

const AVAILABLE = 'available';
const REQUESTED = 'requested';
const OCCUPIED = 'occupied';

function AirplaneSeat(props) {
    const me = { seatRow: props.row, seatCol: props.col };
    const [status, setStatus] = useState(AVAILABLE);
    const { disabledMode } = useContext(disabledModeCtx);
    const { user } = useContext(AuthContext);

    const imInRequested = () => {
        return props.requestedSeats.some(seat => JSON.stringify(seat) === JSON.stringify(me))
    }

    const imInOccupied = () => {
        return props.occupiedSeats.some(seat => seat.seat_col === props.col)
    }

    /** when some seats is requested, both in direct and indirect way, change
     * my status according to the list, only if I'm not occupied 
     * */
    useEffect(() => {
        if (!props.dirty && status !== OCCUPIED) {
            if (imInRequested()) setStatus(REQUESTED);
            else setStatus(AVAILABLE);
        }
    }, [props.requestedSeats]);

    /** when page is loaded check if I'm a occupied seat and change status accordingly */
    useEffect(() => {
        if (!props.dirty) {
            if (imInOccupied()) setStatus(OCCUPIED);
            else if (imInRequested()) setStatus(REQUESTED);
            else
                setStatus(AVAILABLE);
        }
    }, [props.dirty]);

    /** if I'm clicked, available and not in disabled seat map mode, update the requested seats adding me and update status */
    const handleClick = (e) => {
        e.preventDefault();

        if (status != OCCUPIED && !disabledMode && user) {
            if (imInRequested()) {
                const removeMeSeats = props.requestedSeats.filter(seat => JSON.stringify(seat) !== JSON.stringify(me))
                props.setRequestedSeats(removeMeSeats);
                setStatus(AVAILABLE);
            } else {
                props.setRequestedSeats([...props.requestedSeats, { seatRow: props.row, seatCol: props.col }])
                setStatus(REQUESTED)
            }
        }
    }

    const SeatTooltip = (
        <Tooltip>
            <strong  className="text-light">{props.row}/{numberToLetterIndex(props.col)}</strong>
        </Tooltip>
    )

    return (
        <div>
            <OverlayTrigger placement="top" overlay={SeatTooltip}>

            <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 20 20">
                <g>
                    <path className={`${status === AVAILABLE ? 'seat' : ''} ${status}`} d="M20 0v10c0 5.523-4.477 10-10 10S0 15.523 0 10V0"></path>
                </g>
            </svg>
            </OverlayTrigger>
        </div>
    )
}



export default AirplaneSeat;