const express=require("express");
const router=new express.Router();
const morgan=require("morgan");
const slugify = require('slugify')
const ExpressError = require("../expressError");
// const { route } = require("../app");
const db = require("../db");
const middleware=require("../middleware");

router.use(morgan("dev"));

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
// listing all industries, which should show the company code(s) for that industry
router.get("/", async function getAllIndustries(req,res,next){
    try{
        const results=await db.query(`SELECT i.code, i.industry, array_agg(ic.comp_code) AS comp_codes FROM industries AS i join industries_companies as ic ON i.code=ic.industry_code GROUP BY i.code, i.industry`)
        console.log("this is the result ---->" , results)
        console.log("this is the result.rows ---->" , results.rows)
        return res.json(results.rows)

    }
    catch(err){
        return next(err)
    }
})

// INSERT INTO industries (code, industry)
//   VALUES('it', 'information technology'),
//   ('rd', 'research and development'),
//   ('bev', 'beverage services'),
//   ('food', 'food services'),
//   ('hosp', 'hospitality and lodging');

// POST for adding an industry via request body data in form of {code, industry} uses slugify to make 4 letter codes for industries PK
router.post("/", middleware.isValidRequestBodySlugIndustries, async function addIndustry(req,res,next) {
    try{
        console.log("this is the request body---->", req.body)
        let cleanedIndCode = req.body.code
        .replace(/[$#]/g, '') // Remove $ and # specifically---> THIS IS AI REGEX
        .replace(/[^a-zA-Z0-9\s]/g, '') // remove things that are not letters/nums
        .slice(0,4) //shorten to len of 4
        const slugIndCode=slugify(`${cleanedIndCode}`,{
            lower:true, //ensure the string is lowercase only
            replacement: '-', //replace spaces with hypen
            strict: true,
            // custom:{"$":""} this option was supposed to override default character behavior for $. It doesn't work.
        })
        const results=await db.query(`INSERT INTO industries(code, industry) VALUES($1,$2) RETURNING code, industry`,[slugIndCode,req.body.industry])
        return res.status(201).json({newIndustry : results.rows[0]})
    }
    catch(err){
        return next(err)
    }
    


})

// POST for adding an industry/Company Association by adding to the industries_companies join table. Takes data via request body in form of valid industry and company codes. 
// {industry_code, comp_code} uses slugify to make 4 letter codes for industries PK
router.post("/association", async function addIndustryCompany(req,res,next) {
    try{
        console.log("this is the request body---->", req.body)
        const results=await db.query(`INSERT INTO industries_companies(industry_code, comp_code) VALUES($1,$2) RETURNING id, industry_code, comp_code`,[req.body.industry_code,req.body.comp_code])
        return res.status(201).json({newIndustryCompany : results.rows[0]})
    }
    catch(err){
        return next(err)
    }

})

module.exports=router