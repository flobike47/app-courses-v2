export class Token {
    private readonly _accessToken: string
    private readonly _refreshToken: string


    constructor(accessToken: string, refreshToken: string) {
        this._accessToken = accessToken;
        this._refreshToken = refreshToken;
    }

    get accessToken(): string {
        return this._accessToken;
    }

    get refreshToken(): string {
        return this._refreshToken;
    }
}