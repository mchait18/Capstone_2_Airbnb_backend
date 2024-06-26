"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  u3Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /companies */

describe("POST /properties", function () {
  const newProperty = {
    propertyId: 'testId',
    propertyName: 'pName',
    title: 'ptitle',
    imageUrl: 'pImage',
    reviewsCount: '10',
    hostId: 'u1Id',
    hostName: 'hn1',
    hostPhoto: 'h1Photo',
    adults: 1,
    pricePerNight: 100,
    rating: 5,
    city: 'pCity',
    propertyType: 'pType'
  };

  test("ok for owner", async function () {
    const resp = await request(app)
      .post("/properties")
      .send(newProperty)
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      property: newProperty,
    });
  });

  test("unauth for non-admin", async function () {
    const resp = await request(app)
      .post("/properties")
      .send(newProperty)
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/properties")
      .send({
        propertyId: "new",
        reviewsCount: 10,
      })
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/properties")
      .send({
        ...newProperty,
        imageUrl: "not-a-url",
      })
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /companies */

describe("GET /properties/listings/:token", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get(`/properties/listings/${u1Token}`);
    expect(resp.body).toEqual({
      properties:
        [
          {
            propertyId: "p1id",
            propertyName: "p1Name",
            title: "p1title",
            imageUrl: 'http://c1.img',
            adults: 1,
            reviewsCount: '10',
            hostId: "u1Id",
            hostName: "hn1",
            hostPhoto: 'http://h1.img',
            pricePerNight: 100,
            rating: 5,
            city: "p1City",
            propertyType: "p1Type"
          },
          {
            propertyId: "p2id",
            propertyName: "p2Name",
            title: "p2title",
            imageUrl: 'http://c2.img',
            adults: 2,
            reviewsCount: 20,
            hostId: "u1Id",
            hostName: "hn1",
            hostPhoto: 'http://h2.img',
            pricePerNight: 200,
            rating: 5,
            city: "p2City",
            propertyType: "p2Type"
          }
        ],
    });
  });
});

/************************************** GET /properties/:propertyId */

describe("GET /properties/listing/:propertyId", function () {
  test("works for anon", async function () {
    const resp = await request(app).get(`/properties/p1id`);
    expect(resp.body).toEqual({
      propertyId: 'p1id',
      propertyName: 'p1Name',
      title: 'p1title',
      imageUrl: 'http://c1.img',
      reviewsCount: '10',
      hostId: 'u1Id',
      hostName: 'hn1',
      hostPhoto: 'http://h1.img',
      adults: 1,
      pricePerNight: 100,
      rating: 5,
      city: 'p1City',
      propertyType: 'p1Type'
    });
  });

  test("not found for no such property", async function () {
    const resp = await request(app).get(`/properties/listing/nope`);
    expect(resp.statusCode).toEqual(404);
  });
});


