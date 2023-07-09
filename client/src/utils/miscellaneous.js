export function numberToLetterIndex(number) {
    const baseCharCode = 'A'.charCodeAt(0);
    const letterIndex = number + baseCharCode;
    return String.fromCharCode(letterIndex);
}

export function findNFreeSeats(n, occupiedSeats, airplaneConfig) {
    const totalSeats = airplaneConfig.rows * airplaneConfig.cols;
    const requestedSeats = [];

    if (n > totalSeats - occupiedSeats.length)
        return requestedSeats;

    let index = 0;
    while (index < n) {
        const tryRow = Math.floor(Math.random() * airplaneConfig.rows);
        const tryCol = Math.floor(Math.random() * airplaneConfig.cols);

        if (occupiedSeats.some(seat => seat.seat_row === tryRow && seat.seat_col === tryCol) || requestedSeats.some(seat => seat.seatRow === tryRow && seat.seatCol === tryCol)) {
            continue;
        } else {
            requestedSeats.push({ seatRow: tryRow, seatCol: tryCol });
            index++;
        }
    }

    return requestedSeats;
}

