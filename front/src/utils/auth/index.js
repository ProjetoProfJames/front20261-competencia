function getUser() {
    const userStorage = localStorage.getItem('USER');

    if (userStorage) {
        return JSON.parse(userStorage);
    }

    return null;
}

function isAuthenticated() {
    return localStorage.getItem('API-KEY') && getUser();
}

function hasProfile(profiles) {
    const user = getUser();

    if (!profiles || profiles.length === 0) {
        return true;
    }

    return user && profiles.includes(user.profile);
}

function protectPage(profiles) {
    if (!isAuthenticated()) {
        localStorage.removeItem('API-KEY');
        localStorage.removeItem('USER');
        location.href = '/login';
        return null;
    }

    if (!hasProfile(profiles)) {
        location.href = '/nao-autorizado';
        return null;
    }

    return getUser();
}

function logout() {
    localStorage.removeItem('API-KEY');
    localStorage.removeItem('USER');
    location.href = '/login';
}

const auth = {
    getUser,
    isAuthenticated,
    hasProfile,
    protectPage,
    logout
}

export default auth
