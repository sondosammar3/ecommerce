
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            return res.status(500).json({ message: "catch error", error: error.stack });
          
        })
    }
}

//for users errors
export const globalErrorHandler = (err, req, res, next) => {
    return res.status(err.cause || 500).json({ message: err.message });
}