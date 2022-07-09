exports.defaultQuery = (req, res, next) => {
    if (!req.query.limit) {
        req.query.limit = 10;
    }
    if (!req.query.page) {
        req.query.page = 0 * req.query.limit;
    }
    next()
}