const express = require('express');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoute');

const app = express();

app.use('/api/v1/tours', tourRouter);

// error handling middleware
app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!!`, 404));
});

module.exports = app;