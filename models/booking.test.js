"use strict";

const db = require("../db.js");
const { ExpressError, BadRequestError, NotFoundError } = require("../expressError.js");
const Booking = require("./booking.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newBooking = {
    bookingId: "testId",
    userId: "id1",
    propertyId: "P1",
    imageUrl: "http://c1.img",
    location: "testLoc",
    host: "testHost",
    priceTitle: "testTitle",
    cleaningFee: "testCleaning",
    totalPrice: "testPrice",
    checkIn: "2024-08-02T04:00:00.000Z",
    checkOut: "2024-08-22T04:00:00.000Z"
  };

  test("works", async function () {
    let booking = await Booking.create(newBooking);
    expect(booking).toEqual({ id: "testId" });

    const result = await db.query(
      `SELECT id, 
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
    WHERE id ='testId'`);
    expect(result.rows).toEqual([
      {
        id: "testId",
        guestId: "id1",
        propertyId: "P1",
        checkIn: expect.any(Date),
        checkOut: expect.any(Date),
        priceTitle: "testTitle",
        cleaningFee: "testCleaning",
        totalPrice: "testPrice",
        imageUrl: "http://c1.img",
        location: "testLoc",
        host: "testHost"
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Booking.create(newBooking);
      await Booking.create(newBooking);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** getBookings */

describe("getBookings", function () {
  test("works", async function () {
    let bookings = await Booking.getBookings("id1");
    expect(bookings).toEqual([
      {
        id: "B1id"
      },
      {
        id: "B2id"
      }
    ]);
  });
})

/************************************** getBooking */

describe("getBooking", function () {
  test("works", async function () {
    let booking = await Booking.getBooking("B1id");
    expect(booking).toEqual({
      id: "B1id",
      guestId: "id1",
      propertyId: "P1",
      checkIn: expect.any(Date),
      checkOut: expect.any(Date),
      priceTitle: "title1",
      cleaningFee: "cf1",
      totalPrice: "price1",
      imageUrl: "http://h1.img",
      location: "loc1",
      host: "h1"
    });
  });

  test("not found if no such Booking", async function () {
    try {
      await Booking.getBooking("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});



