"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, ExpressError } = require("../expressError");
const { ensureOwner, ensureCorrectUser } = require("../middleware/auth");
const Property = require("../models/property");

const propertyNewSchema = require("../schemas/propertyNew.json");
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

//posts a listing
router.post("/", ensureOwner, async function (req, res, next) {
  try {
    const propertyData = req.body
    propertyData.adults = +propertyData.adults
    propertyData.reviewsCount = +propertyData.reviewsCount
    propertyData.rating = +propertyData.rating
    const validator = jsonschema.validate(propertyData, propertyNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const property = await Property.create(propertyData);
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
 *  *
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

//get user listings
router.get("/listings/:token", ensureOwner, async function (req, res, next) {
  try {
    const token = req.params.token
    const user = jwt.verify(token, SECRET_KEY);
    const userRes = await User.get(user.username)
    const listings = await Property.getListings(userRes.id)
    return res.json({ listings });
  } catch (err) {
    return next(err);
  }
});
//get one listing
router.get("/listing/:propertyId", ensureOwner, async function (req, res, next) {
  try {
    const listing = await Property.getListing(req.params.propertyId)
    return res.json({ listing });
  } catch (err) {
    return next(err);
  }
});
//delete listing
/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: login
 */

router.delete("/listing/:propertyId", ensureOwner, async function (req, res, next) {
  try {
    await Property.remove(req.params.propertyId);
    return res.json({ deleted: req.params.propertyId });
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
router.get("/favorites/:token", ensureCorrectUser, async function (req, res, next) {
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
    return res.json({});
  } catch (err) {
    return next(err);
  }
});




module.exports = router;
