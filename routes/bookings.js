"use strict";

/** Routes for bookings. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, ExpressError } = require("../expressError");
const { ensureOwner } = require("../middleware/auth");
const Booking = require("../models/booking");

const bookingNewSchema = require("../schemas/bookingNew.json");
// const propertySearchSchema = require("../schemas/propertySearch.json");
const AirbnbApiService = require("../services/airbnbApiService")

const router = new express.Router();


/** POST / { booking } =>  { booking }
 *
 * booking should be { userId, propertyId, checkin, checkout, price }
 *
 * Returns {  }
 *
 * Authorization required: login
 */

router.post("/", ensureOwner, async function (req, res, next) {
    try {
        console.log("req.body is", req.body,
            "req.query is ", req.query
        )
        const validator = jsonschema.validate(req.body, bookingNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const booking = await Booking.create(req.body);
        return res.status(201).json({ booking });
    } catch (err) {
        return next(err);
    }
});

/** GET /  =>
 *   { properties: [ {  }, ...] }
 *
 * Can filter on provided search filters:
 * - Location
 * - Check in date
 * - Check out date
 * - Number of guests
 * - bedrooms
 * - bathrooms
 * - property type
 * - price range?
 *
 * Authorization required: none
 */

// router.get("/", async function (req, res, next) {
//     try {
//         const searchTerms = req.query
//         searchTerms.adults = +searchTerms.adults
//         const validator = jsonschema.validate(searchTerms, propertySearchSchema);
//         if (!validator.valid) {
//             const errs = validator.errors.map(e => e.stack);
//             throw new BadRequestError(errs);
//         }
//         const properties = await AirbnbApiService.searchProperties(searchTerms)
//         return res.json({ properties });
//     } catch (err) {
//         return next(err);
//     }
// });

// /** GET /[id]  =>  { property }
//  *
//  *  Property is {  }
//  *    *
//  * Authorization required: none
//  */

// router.get("/:propertyId", async function (req, res, next) {
//     try {
//         const property = await AirbnbApiService.getProperty(req.params.propertyId)
//         return res.json({ property });
//     } catch (err) {
//         return next(err);
//     }
// });

router.get("/checkPrice", async function (req, res, next) {
    try {
        const bookingData = req.query
        console.log("bookingData is ", bookingData)
        bookingData.adults = +bookingData.adults
        const validator = jsonschema.validate(bookingData, bookingNewSchema)
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const price = await AirbnbApiService.getBookingPrice(bookingData)
        console.log("in route, price is ", price)
        return res.json({ price });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[id] {  } => { property }
 *
 * Patches property data.
 *
 * fields can be: {}
 *
 * Returns {  }
 *
 * Authorization required: login
 */

// router.patch("/:propertyId", ensureOwner, async function (req, res, next) {
//     try {
//         const validator = jsonschema.validate(req.body, propertyUpdateSchema);
//         if (!validator.valid) {
//             const errs = validator.errors.map(e => e.stack);
//             throw new BadRequestError(errs);
//         }

//         const property = await Property.update(req.params.id, req.body);
//         return res.json({ property });
//     } catch (err) {
//         return next(err);
//     }
// });

// /** DELETE /[id]  =>  { deleted: id }
//  *
//  * Authorization: login
//  */

// router.delete("/:propertyId", ensureOwner, async function (req, res, next) {
//     try {
//         await Property.remove(req.params.id);
//         return res.json({ deleted: req.params.id });
//     } catch (err) {
//         return next(err);
//     }
// });


module.exports = router;
