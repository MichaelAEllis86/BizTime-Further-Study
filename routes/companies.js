const express=require("express");
const router=new express.Router();
const morgan=require("morgan");
const slugify = require('slugify')
const ExpressError = require("../expressError");
// const { route } = require("../app");
const db = require("../db");
const middleware=require("../middleware");


//
router.use(morgan("dev"));

// GET all companies
router.get("/", async function getAllCompanies(req,res,next){
    try{
        const results=await db.query(`SELECT * FROM companies`)
        console.log("this is results ---->" , results)
        console.log("this is results.rows ---->" , results.rows)
        return res.json({companies:results.rows});
    }
    catch(err){
        return next(err)
    }
})

//old route from part1 works great just doesn't do anything with the M2M
// GET a company based on route param 
// router.get("/:code", async function getCompanyByCode(req,res,next){
//     try{
//         let companyCode=req.params.code
//         //parameterized query
//         const results=await db.query(`SELECT * FROM companies WHERE code =$1`, [companyCode])
//         console.log("this is the result ---->" , results)
//         console.log("this is the result.rows ---->" , results.rows)
//         // if we dont get anything in results.rows we throw a 404
//         if (results.rows.length===0){
//             throw new ExpressError("Company not found",404)
//             }
//             return res.json({company:results.rows});
//         }
//     catch(err){
//         return next(err)
//     }
// })

// GET a company based on route param 
router.get("/:code", async function getCompanyAndIndustries(req,res,next){
    try{
        let companyCode=req.params.code
        //parameterized query
        const results=await db.query(`SELECT c.code, c.name, c.description, i.industry FROM companies AS c JOIN industries_companies AS ic ON c.code=ic.comp_code JOIN industries AS i ON ic.industry_code=i.code WHERE c.code =$1`, [companyCode])
        console.log("this is the result ---->" , results)
        console.log("this is the result.rows ---->" , results.rows)
        // if we dont get anything in results.rows we throw a 404
        if (results.rows.length===0){
            throw new ExpressError("Company not found",404)
            }
            const {code, name, description}=results.rows[0]
            const industries=results.rows.map(i => i.industry)
            return res.json({code,name,description,industries});  
        }
    catch(err){
        return next(err)
    }
})


// POST a new company via data in the request body. Validates request body format.
router.post("/", middleware.isValidRequestBodyCompanies, async function addCompany(req,res,next){
    try{
        console.log("this is the request body---->", req.body)
        const results=await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [req.body.code, req.body.name, req.body.description])
        return res.status(201).json({newCompany : results.rows[0]})

    }
    catch(err){
        return next(err)

    }
})

// POST a new company via data in the request body. Validates request body format. Uses slugify to make a company code
router.post("/slug", middleware.isValidRequestBodySlugCompanies, async function addCompanySlugifyCode(req,res,next){
    try{
        console.log("this is the request body---->", req.body)
        // slugify is annoying. 
        // To actually get rid of it replacing predefined characters like $ as "dollar" I need to preclean the string as Slugify is by default using chracter replacements like this that we don't want!!!!!!
        // we should prolly limit the length of the code to something like 4-5 characters... I could trim the string to do this so we'd have nicer looking short comp codes
        let cleanedName = req.body.name
            .replace(/[$#]/g, '') // Remove $ and # specifically---> THIS IS AI REGEX
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .slice(0,4) // Trim up the code so it keeps to length of 5 characters or less
        // now we slugify the cleaned string (which slugify should be cleaning for me.....I shouldn't have to do a packages work for it. ))
        const slugCode=slugify(`${cleanedName}`,{
            lower:true, //ensure the string is lowercase only
            replacement: '-', //replace spaces with hypen
            strict: true,
            // custom:{"$":""} this option was supposed to override default character behavior for $. It doesn't work.
        })
        console.log("this is the generated slugCode ---->", slugCode)
        const results=await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [slugCode, req.body.name, req.body.description])
        return res.status(201).json({newCompany : results.rows[0]})
        

    }
    catch(err){
        return next(err)

    }
})


// UPDATE an existing company based on route param
router.put("/:code", async function updateCompany(req,res,next){
    try{
        let companyCode=req.params.code
        const results=await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`, [req.body.name, req.body.description, companyCode])
        console.log("this is the result ---->" , results)
        console.log("this is the result.rows ---->" , results.rows)
        return res.send(results.rows[0]);
    }
    catch(err){
        return next(err)
    }
    

})

// DELETE an existing company based on route param (Delete operation works on database were)
router.delete("/:code", async function deleteCompany(req,res,next){
    try{
        let companyCode=req.params.code
        // I just a did separate query to check if the company we target for deletion is there or not. 
        const checkCodeQuery=await db.query(`SELECT * FROM companies WHERE code =$1`, [companyCode])
        // if company is missing from db throw 404
        if (checkCodeQuery.rows.length===0){
            throw new ExpressError("Company not found",404)
            }
        // if we get this far do the deletion operation
        const results=await db.query(`DELETE FROM companies WHERE code=$1`,[companyCode])
        return res.json({status:"Deleted"});
    }
    catch(err){
        return next(err)
    }
   


})

module.exports=router