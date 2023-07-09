'use strict';

exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    
    res.status(401);
    res.json({message: 'Not authorized.'});
}