const login = async (loginPayload) => {
    const response = await fetch("/auth/signin/", {
        method: "POST",
        body: JSON.stringify(loginPayload),
        headers: {
            "Content-Type": "application/json",
        },
    });

    let body = await response.json();
    let data = {status: response.status, body};
    
    if (!response.ok) {
        throw (data);
    }

    return data;
}

const logout = async () => {
    await fetch("/auth/logout/");
}

const getPlayer = async () => {
    const response = await fetch("/auth/player/");

    let body = await response.json();
    let data = {status: response.status, body};
    
    if (!response.ok) {
        throw (data);
    }

    return data;
}

export default {
    login,
    logout,
    getPlayer
}