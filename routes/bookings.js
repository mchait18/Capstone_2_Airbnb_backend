"use strict";

/** Routes for bookings. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, ExpressError } = require("../expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const Booking = require("../models/booking");
const User = require("../models/user");

const bookingNewSchema = require("../schemas/bookingNew.json");
const bookingCheckPriceSchema = require("../schemas/bookingCheck.json");
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

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
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
 *   { bookings: [ {  }, ...] }
 * * 
 * Authorization required: logged in
 */

router.get("/", ensureCorrectUser, async function (req, res, next) {
    try {
        const user = await User.get(res.locals.user.username)
        const bookings = await Booking.getBookings(user.id)
        return res.json({ bookings });
    } catch (err) {
        return next(err);
    }
});

/** GET /[id]  =>  { booking }
 *
 *  Booking is {  }
 *    *
 * Authorization required: none
 */
router.get("/checkPrice", async function (req, res, next) {
    try {
        const bookingData = req.query
        bookingData.adults = +bookingData.adults
        const validator = jsonschema.validate(bookingData, bookingCheckPriceSchema)
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const price = await AirbnbApiService.getBookingPrice(bookingData)
        return res.json({ price });
    } catch (err) {
        return next(err);
    }
});

router.get("/:bookingId", ensureCorrectUser, async function (req, res, next) {
    try {
        const booking = await Booking.getBooking(req.params.bookingId)
        return res.json({ booking });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
