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

  static async create({
    bookingId,
    userId,
    propertyId,
    checkIn,
    checkOut,
    priceTitle,
    cleaningFee,
    totalPrice,
    imageUrl,
    location,
    host }) {
    const duplicateCheck = await db.query(
      `SELECT id
           FROM bookings
           WHERE id = $1`,
      [bookingId]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate booking`);

    const result = await db.query(
      `INSERT INTO bookings
           (id, guest_id, property_id, check_in, check_out, 
            price_title, cleaning_fee, total_price,
          image_url, location, host)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           RETURNING id`,
      [
        bookingId,
        userId,
        propertyId,
        checkIn,
        checkOut,
        priceTitle,
        cleaningFee,
        totalPrice,
        imageUrl,
        location,
        host
      ],
    );

    const booking = result.rows[0];
    return booking;
  }
  static async getBookings(userId) {
    const bookingRes = await db.query(
      `SELECT 
          id                  
      FROM bookings 
      WHERE guest_id = $1`,
      [userId]);

    const bookings = bookingRes.rows;

    if (!bookings) throw new NotFoundError(`No booking: ${id}`);

    return bookings;
  }

  static async getBooking(id) {
    const bookingRes = await db.query(
      `SELECT 
          id, 
          guest_id AS "guestId", 
          property_id AS "propertyId", 
          check_in AS "checkIn", 
          check_out AS "checkOut", 
          price_title AS "priceTitle",
          cleaning_fee AS "cleaningFee",
          total_price AS "totalPrice",
          image_url AS "imageUrl",
          location AS "location", 
          host 
      FROM bookings 
      WHERE id = $1`,
      [id]);

    const booking = bookingRes.rows[0];

    if (!booking) throw new NotFoundError(`No booking: ${id}`);

    return booking;
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
