class CustomError extends Error {
    constructor(statusCode, statusMessage, message) {
        super(message);
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
    }
}

export default CustomError;
