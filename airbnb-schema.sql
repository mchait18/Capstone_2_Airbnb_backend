-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/kQKlMU
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

CREATE TABLE "properties" (
    "property_id" TEXT   NOT NULL,
    "title" TEXT   NOT NULL,
    "city" TEXT NOT NULL,
    "host_id" TEXT   NOT NULL,
    "host_name" TEXT   NOT NULL,
    "host_photo" TEXT   NOT NULL,
    "image_url" TEXT   NOT NULL,
    "adults" int   NOT NULL,
    "reviews_count" int   NOT NULL,
    "name" TEXT   NOT NULL,
    "property_type" TEXT   NOT NULL,
    CONSTRAINT "pk_properties" PRIMARY KEY (
        "property_id"
     )
);

CREATE TABLE "bookings" (
    "id" TEXT   NOT NULL,
    "guest_id" TEXT   NOT NULL,
    "property_id" TEXT   NOT NULL,
    "check_in" date   NOT NULL,
    "check_out" date   NOT NULL,
    "price_title" TEXT   NOT NULL,
    "cleaning_fee" TEXT   NOT NULL,
    "total_price" TEXT   NOT NULL,
    "image_url" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "host" TEXT NOT NULL,
     CONSTRAINT "pk_bookings" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "users" (
    "id" TEXT   NOT NULL,
    "email" TEXT   NOT NULL,
    "first_name" TEXT   NOT NULL,
    "last_name" TEXT   NOT NULL,
    "username" TEXT   NOT NULL,
    "password" text   NOT NULL,
    "is_owner" boolean NOT NULL,
    CONSTRAINT "pk_users" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "amenities" (
    "id" TEXT   NOT NULL,
    -- indoor, outdoor, area, water, kosher
    "type" TEXT   NOT NULL,
    "name" text   NOT NULL,
    CONSTRAINT "pk_amenities" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "house_amenities" (
    "property" TEXT   NOT NULL,
    "amenities_id" TEXT   NOT NULL
);

CREATE TABLE "available_dates" (
    "property_id" TEXT   NOT NULL,
    "start_date" date   NOT NULL,
    "end_date" date   NOT NULL
);

CREATE TABLE "images" (
    "id" TEXT   NOT NULL,
    "property_id" TEXT   NOT NULL,
    "image_url" TEXT   NOT NULL,
    CONSTRAINT "pk_images" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "favorites" (
    "user_id" TEXT   NOT NULL,
    "property_id" TEXT   NOT NULL
);

CREATE TABLE "reviews" (
    "id" TEXT   NOT NULL,
    "property_id" TEXT   NOT NULL,
    "first_name" TEXT   NOT NULL,
    "profile_picture" TEXT   NOT NULL,
    "rating" int   NOT NULL,
    "comments" TEXT   NOT NULL,
    CONSTRAINT "pk_reviews" PRIMARY KEY (
        "id"
     )
);

ALTER TABLE "properties" ADD CONSTRAINT "fk_properties_host_id" FOREIGN KEY("host_id")
REFERENCES "users" ("id");

ALTER TABLE "bookings" ADD CONSTRAINT "fk_bookings_guest_id" FOREIGN KEY("guest_id")
REFERENCES "users" ("id");

ALTER TABLE "house_amenities" ADD CONSTRAINT "fk_house_amenities_property" FOREIGN KEY("property")
REFERENCES "properties" ("property_id");

ALTER TABLE "house_amenities" ADD CONSTRAINT "fk_house_amenities_amenities_id" FOREIGN KEY("amenities_id")
REFERENCES "amenities" ("id");

ALTER TABLE "available_dates" ADD CONSTRAINT "fk_available_dates_property_id" FOREIGN KEY("property_id")
REFERENCES "properties" ("property_id");

ALTER TABLE "images" ADD CONSTRAINT "fk_images_property_id" FOREIGN KEY("property_id")
REFERENCES "properties" ("property_id");

ALTER TABLE "favorites" ADD CONSTRAINT "fk_favorites_user_id" FOREIGN KEY("user_id")
REFERENCES "users" ("id");

ALTER TABLE "favorites" ADD CONSTRAINT "fk_favorites_property_id" FOREIGN KEY("property_id")
REFERENCES "properties" ("property_id");

ALTER TABLE "reviews" ADD CONSTRAINT "fk_reviews_property_id" FOREIGN KEY("property_id")
REFERENCES "properties" ("property_id");

