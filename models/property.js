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

  static async create({ }) {
    const duplicateCheck = await db.query(
      `SELECT handle
           FROM companies
           WHERE handle = $1`,
      [handle]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate company: ${handle}`);

    const result = await db.query(
      `INSERT INTO companies
           (handle, name, description, num_employees, logo_url)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`,
      [
        handle,
        name,
        description,
        numEmployees,
        logoUrl,
      ],
    );
    const company = result.rows[0];

    return company;
  }

  static async get(id) {

    data = res.json()
    const propertyRes = await db.query(
      `SELECT handle,
                  name,
                  description,
                  num_employees AS "numEmployees",
                  logo_url AS "logoUrl"
           FROM companies
           WHERE handle = $1`,
      [handle]);

    const company = companyRes.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    const compJobs = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
      FROM jobs WHERE company_handle = $1`, [handle]);

    const jobData = compJobs.rows

    if (jobData[0]) {
      company.jobs = jobData.map(d => ({
        id: d.id,
        title: d.title,
        salary: d.salary,
        equity: d.equity,
        companyHandle: d.companyHandle
      }))
    }
    return company;
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
