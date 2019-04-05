exports.permit =  function (...allowed) {
    const isAllowed = role => allowed.indexOf(role) > -1;

    // return a middleware
    return (request, response, next) => {
        console.log(request.user.role);
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

exports.authenticatePlacementOfficerUpdate = function() {
    return(req, res, next) => {
        if (req.user.role != 'admin' && req.body.placementOfficer != undefined) {
            return res.status(401).send({
                messages: "Placement officer not updated, only an Admin can do that."
            });
        }
        next();
    }
}

exports.authenticateVacancyStatusUpdate = function () {
    return (req, res, next) => {
        if (req.user.role != 'admin' && (req.body.status != undefined && req.body.status != "Pending Verification")) {
            return res.status(401).send({
                messages: "Placement officer can only update status to Pending Verification."
            });
        }
        next();
    }
}