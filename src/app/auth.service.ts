
export class AuthService {
loggedIn: boolean;
    isAuthenticated() {
        const promise = new Promise ((resolve, reject) => {
            setTimeout(() => {
                resolve(this.loggedIn)
            }, 500);
        })

        return promise;
    }

    login() {
        this.loggedIn = true;
    }

    logout() {
        this.loggedIn = false;
    }
}