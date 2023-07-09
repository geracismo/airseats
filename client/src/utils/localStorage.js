export function deleteUserInfo() {
    localStorage.removeItem("ASuser");
    localStorage.removeItem("local");
    localStorage.removeItem("regional");
    localStorage.removeItem("international");
}

export function addUserInfo(username, id) {
    localStorage.setItem("ASuser", username);
    localStorage.setItem("ASid", id);
}

export function removeReqSeats(type) {
    localStorage.removeItem(type);
}

export function addReqSeats(name, value) {
    const valueString = JSON.stringify(value);
    localStorage.setItem(name, valueString);
}

export function getReqSeats(name) {
    try {
        const json = localStorage.getItem(name);
        if (json)
            return JSON.parse(json);
        else
            return [];
    } catch (error) {
        return [];
    }
}

export function wasILoggedIn() {
    const username = localStorage.getItem("ASuser");
    const id = localStorage.getItem("ASid");
    return {username, id}
}



