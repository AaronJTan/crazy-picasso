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

    localStorage.setItem("user", JSON.stringify(body));

    return data;
}

export default {
    login
}