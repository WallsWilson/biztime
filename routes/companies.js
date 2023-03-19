const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");
var slugify = require('slugify');

router.get('/', async function(req, res, next) {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({companies: results.rows})
    } catch(e) {
        return next(e);
    }
});

router.get('/:code', async function( req, res, next) {
    try{
        const { code } = req.params;
        const results = await db.query(`SELECT * FROM ccompanies WHERE code = $1`, [code])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find ccompany with the code of ${code}`, 404)
        }
        return res.send({code: results.row[0]})
    }catch(e) {
        return next(e)
    }
})

router.post('/', async function(req, res, next) {
    try {
        const {code, name, description} = req.body;
        const results = await db.query(`INSERT INTO ccompanies (code, name, description) VALUES ($1, $2) RETURNING code, name, description`, [code, name, description]);
        return res.status(201).json.slugify({companies: results.rows[0]})
    } catch (e){
        return next(e)
    }
})


router.put('/:code', async function(req,res,next) {
    try {
        const paidToday = await db.query(
            `UPDATE invoices SET paid_date=$1`, [req.params.paid_date]);

        const unPay = await db.query(
            `UPDATE invoices SET paid_date=null`, [req.params.paid_date]);

        const date = new Date();

        if(date === paidToday) {
            return res.json({amt, paid})
        } if(unPay === True) {
            return res.json({amt, paid})
        } else {
            return
        }


    } catch (err) {
        return next(err);
    }
});

router.delete('/:code', async function(req,res,next) {
    try{
        const results = db.query(`DELETE FROM companies WHERE code = $1`, [req.params.code])
        return res.send({msg: "Deleted!"})
    } catch (e) {
        return next(e)
    }
})

module.exports = router;