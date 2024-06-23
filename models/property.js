"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for Proprties. */

class Property {
  /** Create a property (from data), update db, return new property data.
   *
   * data should be { }
   *
   * Returns { }
   *
   * Throws BadRequestError if property already in database.
   * */

  static async create({
    propertyId,
    propertyName,
    title,
    imageUrl,
    adults,
    reviewsCount,
    hostId,
    hostName,
    hostPhoto,
    pricePerNight,
    rating,
    city,
    propertyType
  }) {
    const duplicateCheck = await db.query(
      `SELECT property_id
           FROM properties
           WHERE property_id = $1`,
      [propertyId]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate property`);

    const result = await db.query(
      `INSERT INTO properties
           (property_id, property_name, title, image_url, adults, reviews_count,
          host_id, host_name, host_photo, price_per_night, rating, city, property_type)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           RETURNING property_id AS "propertyId", 
           property_name AS "propertyName", 
           title, 
           image_url AS "imageUrl", 
           adults,
           reviews_count AS "reviewsCount",
           host_id AS "hostId", 
           host_name AS "hostName", 
           host_photo AS "hostPhoto", 
           price_per_night AS "pricePerNight", 
           rating, 
           city, 
           property_type AS "propertyType"`,
      [
        propertyId,
        propertyName,
        title,
        imageUrl,
        adults,
        reviewsCount,
        hostId,
        hostName,
        hostPhoto,
        pricePerNight,
        rating,
        city,
        propertyType
      ],
    );
    const property = result.rows[0];

    return property;
  }
  //get user listings
  static async getListings(userId) {

    const listingsRes = await db.query(
      `SELECT property_id AS "propertyId", 
           property_name AS "propertyName", 
           title, 
           image_url AS "imageUrl", 
           adults,
           reviews_count AS "reviewsCount",
           host_id AS "hostId", 
           host_name AS "hostName", 
           host_photo AS "hostPhoto", 
           price_per_night AS "pricePerNight", 
           rating, 
           city, 
           property_type AS "propertyType"
    FROM properties
    WHERE host_id = $1`,
      [userId]);

    const listings = listingsRes.rows;

    if (!listings) throw new NotFoundError(`No listings`);

    return listings;
  }
  //gets one listing
  static async getListing(propertyId) {
    const listingRes = await db.query(
      `SELECT property_id AS "propertyId", 
           property_name AS "propertyName", 
           title, 
           image_url AS "imageUrl", 
           adults,
           reviews_count AS "reviewsCount",
           host_id AS "hostId", 
           host_name AS "hostName", 
           host_photo AS "hostPhoto", 
           price_per_night AS "pricePerNight", 
           rating, 
           city, 
           property_type AS "propertyType"
    FROM properties
    WHERE property_id = $1`,
      [propertyId]);

    const listing = listingRes.rows[0];

    if (!listing) throw new NotFoundError(`No listing found`);

    return listing;
  }
  //getFavorites
  static async getFavorites(userId) {

    const favoriteRes = await db.query(
      `SELECT property_id AS "propertyId",
              property_name AS "propertyName",
              image_url AS "imageUrl",
              rating,
              title
      FROM favorites
      WHERE user_id = $1`,
      [userId]);

    const favorites = favoriteRes.rows;

    if (!favorites) throw new NotFoundError(`No favorites`);

    return favorites;
  }

  //add/remove Favorite
  static async toggleFavorite(userId, propertyId, propertyName, rating, title, imageUrl) {
    const favoriteCheck = await db.query(
      `SELECT user_id, property_id
           FROM favorites
           WHERE user_id = $1 AND property_id= $2`,
      [userId, propertyId]);
    console.log("property_id is ", propertyId, "userID is ", userId)
    if (favoriteCheck.rows[0]) {
      await db.query(
        `DELETE 
         FROM favorites
         WHERE user_id = $1 
         AND property_id= $2`,
        [userId, propertyId],
      );
    }
    else {
      await db.query(
        `INSERT INTO favorites
           (user_id, property_id, property_name, rating, title, image_url)
           VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, propertyId, propertyName, rating, title, imageUrl],
      );
    }
  }


  /** Update company data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, description, numEmployees, logoUrl}
   *
   * Returns {handle, name, description, numEmployees, logoUrl}
   *
   * Throws NotFoundError if not found.
   */

  static async update(handle, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        numEmployees: "num_employees",
        logoUrl: "logo_url",
      });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE companies 
                      SET ${setCols} 
                      WHERE handle = ${handleVarIdx} 
                      RETURNING handle, 
                                name, 
                                description, 
                                num_employees AS "numEmployees", 
                                logo_url AS "logoUrl"`;
    const result = await db.query(querySql, [...values, handle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    return company;
  }

  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(handle) {
    const result = await db.query(
      `DELETE
           FROM companies
           WHERE handle = $1
           RETURNING handle`,
      [handle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);
  }
}


module.exports = Property;
