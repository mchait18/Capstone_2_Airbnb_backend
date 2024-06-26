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
    console.log("in model, booking is ", booking)
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

}


module.exports = Booking;
