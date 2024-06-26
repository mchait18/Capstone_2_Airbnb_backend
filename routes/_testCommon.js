"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Property = require("../models/property");
const Booking = require("../models/booking");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM bookings");
  await db.query("DELETE FROM properties");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await User.register({
    id: "u1Id",
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isOwner: true,
  });
  await User.register({
    id: "u2Id",
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isOwner: true,
  });
  await User.register({
    id: "u3Id",
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isOwner: false,
  });

  await Property.create(
    {
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
  await Property.create(
    {
      propertyId: 'p2id',
      propertyName: 'p2Name',
      title: 'p2title',
      imageUrl: 'http://c2.img',
      reviewsCount: 20,
      hostId: 'u1Id',
      hostName: 'hn1',
      hostPhoto: 'http://h2.img',
      adults: 2,
      pricePerNight: 200,
      rating: 5,
      city: 'p2City',
      propertyType: 'p2Type'
    });
  await Property.create(
    {
      propertyId: 'p3id',
      propertyName: 'p3Name',
      title: 'p3title',
      imageUrl: 'p3Image',
      reviewsCount: '30',
      hostId: 'u2Id',
      hostName: 'hn2',
      hostPhoto: 'h2Photo',
      adults: 3,
      pricePerNight: 300,
      rating: 5,
      city: 'p3City',
      propertyType: 'p3Type'
    });

}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ username: "u1", isOwner: true });
const u2Token = createToken({ username: "u2", isOwner: true });
const u3Token = createToken({ username: "u3", isOwner: false });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  u3Token,
};
