"use strict";

const db = require("../db.js");
const { ExpressError, BadRequestError, NotFoundError } = require("../expressError.js");
const Property = require("./property.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newProperty = {
    propertyId: "testId",
    propertyName: "testProperty",
    title: "testTitle",
    imageUrl: "testImg",
    adults: 1,
    reviewsCount: 20,
    hostId: "id2",
    hostName: "testHostName",
    hostPhoto: "testHostPhoto",
    pricePerNight: "100",
    rating: 5,
    city: "testCity",
    propertyType: "testType"
  };

  test("works", async function () {
    let property = await Property.create(newProperty);
    expect(property).toEqual(newProperty);

    const result = await db.query(
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
    WHERE host_id ='id2'`);
    expect(result.rows).toEqual([
      {
        propertyId: "testId",
        propertyName: "testProperty",
        title: "testTitle",
        imageUrl: "testImg",
        adults: 1,
        reviewsCount: 20,
        hostId: "id2",
        hostName: "testHostName",
        hostPhoto: "testHostPhoto",
        pricePerNight: "100",
        rating: 5,
        city: "testCity",
        propertyType: "testType"
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Property.create(newProperty);
      await Property.create(newProperty);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** getListings */

describe("getListings", function () {
  test("works", async function () {
    let properties = await Property.getListings('id1');
    expect(properties).toEqual([
      {
        propertyId: "P1",
        propertyName: "P1",
        title: "T1",
        imageUrl: 'http://c1.img',
        adults: 1,
        reviewsCount: 10,
        hostId: "id1",
        hostName: "hn1",
        hostPhoto: 'http://h1.img',
        pricePerNight: "100",
        rating: 5,
        city: "c1",
        propertyType: "t1"
      },
      {
        propertyId: "P2",
        propertyName: "P2",
        title: "T2",
        imageUrl: 'http://c2.img',
        adults: 2,
        reviewsCount: 20,
        hostId: "id1",
        hostName: "hn2",
        hostPhoto: 'http://h2.img',
        pricePerNight: "200",
        rating: 5,
        city: "c2",
        propertyType: "t2"
      },
      {
        propertyId: "P3",
        propertyName: "P3",
        title: "T3",
        imageUrl: 'http://c3.img',
        adults: 3,
        reviewsCount: 30,
        hostId: "id1",
        hostName: "hn3",
        hostPhoto: 'http://h3.img',
        pricePerNight: "300",
        rating: 5,
        city: "c3",
        propertyType: "t3"
      },
    ]);
  });
})

/************************************** getListing */

describe("getListing", function () {
  test("works", async function () {
    let property = await Property.getListing("P1");
    expect(property).toEqual({
      propertyId: "P1",
      propertyName: "P1",
      title: "T1",
      imageUrl: 'http://c1.img',
      adults: 1,
      reviewsCount: 10,
      hostId: "id1",
      hostName: "hn1",
      hostPhoto: 'http://h1.img',
      pricePerNight: "100",
      rating: 5,
      city: "c1",
      propertyType: "t1"
    });
  });

  test("not found if no such Property", async function () {
    try {
      await Property.getListing("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Property.remove("P1");
    const res = await db.query(
      "SELECT property_id FROM properties WHERE property_id='P1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such property", async function () {
    try {
      await Property.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
