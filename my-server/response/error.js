// respone/error.js
module.exports.CreateError= (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
};
