const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

router.get('/', async function(req, res, next) {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({invoices: results.rows})
    } catch(e) {
        return next(e);
    }
});


router.get('/:id', async function( req, res, next) {
    try{
        const { id } = req.params;
        const results = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with the id of ${id}`, 404)
        }
        return res.send({id: results.row[0]})
    }catch(e) {
        return next(e)
    }
})


router.post('/', async function(req, res, next) {
    try {
        const {id, amt, paid, add_date, paid_date, company: {code, name, description}} = req.body;
        const results = await db.query(`INSERT INTO ccompanies (id, amt, paid, add_date, paid_date, company: {code, name, description}) VALUES ($1, $2) RETURNING id, amt, paid, add_date, paid_date, company: {code, name, description}`, [id, amt, paid, add_date, paid_date, company]);
        return res.status(201).json({invoices: results.rows[0]})
    } catch (e){
        return next(e)
    }
})

router.patch('/:id', async function(req,res,next) {
    try {
        const { id } = req.params;
        const { amt } = req.body;
        const results = await db.query(`UPDATE invoices SET amt = $1 WHERE id=$2 RETURNING invoice: {id, comp_code, amt, paid, add_date, paid_date}`, [amt, id])
        if (results.rows.length === 0) {
            throw new ExpressError (`Can't update company with code ${id}`, 404)
        }
        return res.send({invoice: results.rows[0]})
    } catch (e) {
        return next(e)
    }
});

router.delete('/:id', async function(req,res,next) {
    try{
        const results = db.query(`DELETE FROM invoices WHERE id = $1`, [req.params.id])
        return res.send({msg: "Deleted!"})
    } catch (e) {
        return next(e)
    }
})

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

module.exports = router;