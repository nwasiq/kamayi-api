exports.permit =  function (...allowed) {
    const isAllowed = role => allowed.indexOf(role) > -1;

    // return a middleware
    return (request, response, next) => {
        if (request.user && isAllowed(request.user.role)){
            next(); // role is allowed, so continue on the next middleware
        }
        else {
            response.status(403).json({ message: "Forbidden" }); // user is forbidden
        }
    }
}

exports.authenticateUserCreate = function(){
    return (req, res, next) => {
        if (req.user.role != 'superAdmin' && 
            (req.body.role == 'admin' || req.body.role == 'superAdmin')) {
            return res.status(401).send({
                messages: "Only a Super Admin can create an Admin"
            });
        }

        if (req.user.role == 'superAdmin' && req.body.role == 'superAdmin') {
            return res.status(401).send({
                messages: "Only one super admin allowed"
            });
        }

        next();
    }
}

exports.authenticateUserUpdate = function(){
    return (req, res, next) => {
        if (req.user.role == 'admin' && req.body.role == 'superAdmin') {
            return res.status(401).send({
                messages: "An Admin cannot update anyone to Super Admin"
            });
        }
        next();
    }
}