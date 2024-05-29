"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for Proprties. */

class Booking {
  /** Create a booking (from data), update db, return new booking data.
   *
   * data should be { }
   *
   * Returns { }
   *
   * Throws BadRequestError if booking already in database.
   * */

  static async create({ bookingId, username, propertyId, checkin, checkout, }) {
    const duplicateCheck = await db.query(
      `SELECT id
           FROM bookings
           WHERE id = $1`,
      [id]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate booking`);

    const result = await db.query(
      `INSERT INTO bookings
           (id, username, property_id, checkin, checkout, price)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, guest_id AS "guestId, 
           property_id AS "propertyId, checkin, checkout, price`,
      [
        bookingId,
        username,
        propertyId,
        checkin,
        checkout,
        price,
      ],
    );
    const booking = result.rows[0];

    return booking;
  }

  // static async get(id) {

  //   data = res.json()
  //   const propertyRes = await db.query(
  //     `SELECT handle,
  //                 name,
  //                 description,
  //                 num_employees AS "numEmployees",
  //                 logo_url AS "logoUrl"
  //          FROM companies
  //          WHERE handle = $1`,
  //     [handle]);

  //   const company = companyRes.rows[0];

  //   if (!company) throw new NotFoundError(`No company: ${handle}`);

  //   const compJobs = await db.query(
  //     `SELECT id, title, salary, equity, company_handle AS "companyHandle"
  //     FROM jobs WHERE company_handle = $1`, [handle]);

  //   const jobData = compJobs.rows

  //   if (jobData[0]) {
  //     company.jobs = jobData.map(d => ({
  //       id: d.id,
  //       title: d.title,
  //       salary: d.salary,
  //       equity: d.equity,
  //       companyHandle: d.companyHandle
  //     }))
  //   }
  //   return company;
  // }

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

  // static async update(handle, data) {
  //   const { setCols, values } = sqlForPartialUpdate(
  //     data,
  //     {
  //       numEmployees: "num_employees",
  //       logoUrl: "logo_url",
  //     });
  //   const handleVarIdx = "$" + (values.length + 1);

  //   const querySql = `UPDATE companies 
  //                     SET ${setCols} 
  //                     WHERE handle = ${handleVarIdx} 
  //                     RETURNING handle, 
  //                               name, 
  //                               description, 
  //                               num_employees AS "numEmployees", 
  //                               logo_url AS "logoUrl"`;
  //   const result = await db.query(querySql, [...values, handle]);
  //   const company = result.rows[0];

  //   if (!company) throw new NotFoundError(`No company: ${handle}`);

  //   return company;
  // }

  // /** Delete given company from database; returns undefined.
  //  *
  //  * Throws NotFoundError if company not found.
  //  **/

  // static async remove(handle) {
  //   const result = await db.query(
  //     `DELETE
  //          FROM companies
  //          WHERE handle = $1
  //          RETURNING handle`,
  //     [handle]);
  //   const company = result.rows[0];

  //   if (!company) throw new NotFoundError(`No company: ${handle}`);
  // }
}


module.exports = Booking;
