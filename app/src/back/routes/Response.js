class Response {
    constructor(success, data, message) {
        this._success = success;
        this._data = data;
        this._message = message;
    }

    get success() {
        return this._success || 0;
    }

    set success(data) {
        this._success = +data ? 1 : 0;
    }

    get data() {
        return this._data || {};
    }

    set data(data) {
        this._data = data;
    }

    get message() {
        return this._message || "";
    }

    set message(message) {
        this._message = message;
    }

    getObject() {
        return {
            success: this.success,
            message: this.message,
            data: this.data
        };
    }
}

module.exports = Response;
