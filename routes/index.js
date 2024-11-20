const initializeRoutes = (app) => {
    app.use('/api/v1/booking', require('./v1/bookingRoutes.js'));
    app.use('/api/v1/document-upload', require('./v1/userDocRoutes.js'))
};

module.exports = initializeRoutes;