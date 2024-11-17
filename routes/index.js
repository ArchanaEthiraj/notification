const initializeRoutes = (app) => {
    app.use('/api/v1/booking', require('./v1/bookingRoutes.js'));
};

module.exports = initializeRoutes;