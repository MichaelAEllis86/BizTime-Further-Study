const ExpressError = require("./expressError")

function isValidRequestBodyCompanies(req,res,next){
    try{
        if(!req.body.code || !req.body.name || !req.body.description ){
            throw new ExpressError("Bad Request! Missing JSON data! Please include json for your company in the request body in the following format----> {'code':'Dell', 'name':'Dell INC', 'description':'box computer retailer'}!",400)
        }
        // very important call of next() here. If it isn't called we can't move onto the route handler or next middleware.
        next();
    }
    catch(err){
        return next(err);
    }
}

function isValidRequestBodySlugCompanies(req,res,next){
    try{
        if(!req.body.name || !req.body.description ){
            throw new ExpressError("Bad Request! Missing JSON data! Please include json for your company in the request body in the following format----> {'name':'Dell INC', 'description':'box computer retailer'}!",400)
        }
        // very important call of next() here. If it isn't called we can't move onto the route handler or next middleware.
        next();
    }
    catch(err){
        return next(err);
    }
}

function isValidRequestBodyAddInvoice(req,res,next){
    try{
        if(!req.body.comp_code || !req.body.amt){
            throw new ExpressError("Bad Request! Missing JSON data! Please include json for your invoice in the request body in the following format----> {'comp_code':'apple', 'amt':150.25}",400)
        }
        // very important call of next() here. If it isn't called we can't move onto the route handler or next middleware.
        next();
    }
    catch(err){
        return next(err);
    }
}


function isValidRequestBodyUpdateInvoice(req, res, next){
    try{
        if(!req.body.amt){
            throw new ExpressError("Bad Request! Missing JSON data! Please include json for your invoice in the request body in the following format----> {'amt':150.25}",400)
        }
        // very important call of next() here. If it isn't called we can't move onto the route handler or next middleware.
        next();
    }
    catch(err){
        return next(err);
    }

    }


    function isValidRequestBodyPayInvoice(req, res, next){
        try{
            if(!req.body.amt){
                throw new ExpressError("Bad Request! Missing JSON data! Please include json for your invoice in the request body in the following format----> if changing invoice amt only----> {'amt':150.25} if paying bill ----> {amt:150.23,paid:true} if UNPAYING bill ----> {amt:150.23,paid:false}"  ,400)
            }
            // very important call of next() here. If it isn't called we can't move onto the route handler or next middleware.
            next();
        }
        catch(err){
            return next(err);
        }
    
        }
    
function isValidRequestBodySlugIndustries(req,res,next){
    try{
        if(!req.body.code || !req.body.industry ){
            throw new ExpressError("Bad Request! Missing JSON data! Please include json for your industry in the request body in the following format----> {'code':'gap', 'industry':'clothing'}!",400)
        }
        // very important call of next() here. If it isn't called we can't move onto the route handler or next middleware.
        next();

    }
    catch(err){
        return next(err)
    }
}

module.exports={isValidRequestBodyCompanies:isValidRequestBodyCompanies,
                isValidRequestBodySlugCompanies:isValidRequestBodySlugCompanies,
                isValidRequestBodyAddInvoice:isValidRequestBodyAddInvoice,
                isValidRequestBodyUpdateInvoice:isValidRequestBodyUpdateInvoice,
                isValidRequestBodyPayInvoice:isValidRequestBodyPayInvoice,
                isValidRequestBodySlugIndustries:isValidRequestBodySlugIndustries
            }
