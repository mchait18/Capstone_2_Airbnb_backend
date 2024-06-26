const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");


async function commonBeforeAll() {
  await db.query("DELETE FROM bookings");
  await db.query("DELETE FROM properties");
  await db.query("DELETE FROM users");

  await db.query(`
        INSERT INTO users(id,
                          username,
                          password,
                          first_name,
                          last_name,
                          email,
                          is_owner)
        VALUES ('id1','u1', $1, 'U1F', 'U1L', 'u1@email.com','true'),
               ('id2','u2', $2, 'U2F', 'U2L', 'u2@email.com', 'false')
        RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]);

  await db.query(`
      INSERT INTO properties(property_id, property_name, title, image_url, 
      adults, reviews_count, host_id, host_name, host_photo, 
      price_per_night, rating, city, property_type)
      VALUES ('P1', 'P1','T1', 'http://c1.img', 1, 10, 'id1','hn1',
      'http://h1.img', 100, 5, 'c1', 't1' ),
             ('P2', 'P2','T2', 'http://c2.img', 2, 20, 'id1','hn2',
      'http://h2.img', 200, 5, 'c2', 't2' ),
             ('P3', 'P3','T3', 'http://c3.img', 3, 30, 'id1','hn3',
      'http://h3.img', 300, 5, 'c3', 't3' )`);


  await db.query(`
  INSERT INTO bookings(id, guest_id, property_id, check_in, check_out, 
            price_title, cleaning_fee, total_price,
          image_url, location, host)
  VALUES ('B1id', 'id1','P1', '2024-09-02T04:00:00.000Z', '2024-09-10T04:00:00.000Z', 'title1', 'cf1',
  'price1', 'http://h1.img', 'loc1', 'h1'),
         ('B2id', 'id1','P2', '2024-08-02T04:00:00.000Z', '2024-09-10T04:00:00.000Z', 'title2', 'cf2',
  'price2', 'http://h2.img', 'loc2', 'h2'),
         ('B3id', 'id2','P3', '2024-08-02T04:00:00.000Z', '2024-09-10T04:00:00.000Z', 'title3', 'cf3',
  'price3', 'http://h3.img', 'loc3', 'h3')`);

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


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};