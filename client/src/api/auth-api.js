const APIURL = 'http://localhost:3000';

async function login(credentials) {

    try {
        const response = await fetch(APIURL + '/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials),
            credentials: "include"
        });

        if (response.ok) {
            const user = await response.json();
            return user;
        } else {
            if (response.status === 401) 
                throw { type: 'error', message: 'Wrong username or password.' };
        }
    } catch (e) {
        throw { type: 'error', message: e.message };
    }
}

async function logout() {
    try {
        const response = await fetch(APIURL + '/api/logout', { credentials: "include" });

        if (response.ok) return
        else throw new Error();

    } catch (e) {
        throw new Error(e);
    }
}

async function checkAuth() {
    try {
        const response = await fetch(APIURL + '/api/authentication', { credentials: "include" });
        return response;

    } catch (e) {
        throw new Error(e);
    }
}


export { login, logout, checkAuth };