"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, ExpressError } = require("../expressError");
const { ensureOwner, ensureCorrectUser } = require("../middleware/auth");
const Property = require("../models/property");

// const propertyNewSchema = require("../schemas/propertyNew.json");
// const propertyUpdateSchema = require("../schemas/propertyUpdate.json");
const propertySearchSchema = require("../schemas/propertySearch.json");
const AirbnbApiService = require("../services/airbnbApiService")
const { SECRET_KEY } = require("../config");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

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
    searchTerms.location = searchTerms.location.toLowerCase()
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
    const reviews = await AirbnbApiService.getPropertyReviews(req.params.propertyId)
    return res.json({ reviews });
  } catch (err) {
    return next(err);
  }
});
//get user favorites
router.get("/favorites/:token", async function (req, res, next) {
  try {
    const token = req.params.token
    const user = jwt.verify(token, SECRET_KEY);
    const userRes = await User.get(user.username)
    const favorites = await Property.getFavorites(userRes.id)
    return res.json({ favorites });
  } catch (err) {
    return next(err);
  }
});
//add/remove a favorite
router.post("/favorites/:token", ensureCorrectUser, async function (req, res, next) {
  try {
    const token = req.params.token
    const localUser = jwt.verify(token, SECRET_KEY);
    const user = await User.get(localUser.username)
    const { propertyId, propertyName, rating, title, imageUrl } = req.body
    await Property.toggleFavorite(user.id, propertyId, propertyName, rating, title, imageUrl);
    // return res.json({ applied: jobId });
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
