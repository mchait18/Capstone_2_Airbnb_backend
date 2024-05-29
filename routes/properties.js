"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, ExpressError } = require("../expressError");
const { ensureOwner } = require("../middleware/auth");
const Property = require("../models/property");

// const propertyNewSchema = require("../schemas/propertyNew.json");
// const propertyUpdateSchema = require("../schemas/propertyUpdate.json");
const propertySearchSchema = require("../schemas/propertySearch.json");
const AirbnbApiService = require("../services/airbnbApiService")

const router = new express.Router();


/** POST / { property } =>  { property }
 *
 * property should be {  }
 *
 * Returns {  }
 *
 * Authorization required: login
 */

router.post("/", ensureOwner, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, propertyNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const property = await Property.create(req.body);
    return res.status(201).json({ property });
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

router.get("/", async function (req, res, next) {
  try {
    const searchTerms = req.query
    searchTerms.adults = +searchTerms.adults
    const validator = jsonschema.validate(searchTerms, propertySearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const properties = await AirbnbApiService.searchProperties(searchTerms)
    return res.json({ properties });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { property }
 *
 *  Property is {  }
 *    *
 * Authorization required: none
 */

router.get("/:propertyId", async function (req, res, next) {
  try {
    const property = await AirbnbApiService.getProperty(req.params.propertyId)
    return res.json({ property });
  } catch (err) {
    return next(err);
  }
});

router.get("/reviews/:propertyId", async function (req, res, next) {
  try {
    console.log("in route, get propreviews")
    const reviews = await AirbnbApiService.getPropertyReviews(req.params.propertyId)
    console.log("in route, reviews is ", reviews)
    return res.json({ reviews });
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

router.patch("/:propertyId", ensureOwner, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, propertyUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const property = await Property.update(req.params.id, req.body);
    return res.json({ property });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: login
 */

router.delete("/:propertyId", ensureOwner, async function (req, res, next) {
  try {
    await Property.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
