export const IsAuth = () => {
    const token = localStorage.getItem("_token");
    if (token) {
        const jwtPayload = JSON.parse(window.atob(token.split('.')[1]))
        const timestamp = String(Date.now()).substring(0, 10)
        if (parseInt(timestamp) < jwtPayload.exp) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export const User = () => {
    const profile = JSON.parse(localStorage.getItem("profile"))
    if (profile != null) {
        return profile?.data?.user
    }
}

export const RoutePermissions = () => {
    const profile = JSON.parse(localStorage.getItem("profile"))
    if (profile != null) {
        return profile.data.routes
    }
}

export const IsAdmin = () => {
    const profile = JSON.parse(localStorage.getItem("profile"))
    if (profile != null) {
        if (profile?.data?.roles[0] != null) {
            return profile.data.roles[0].id
        }
    }
}