-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/kQKlMU
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

CREATE TABLE "properties" (
    "property_id" int   NOT NULL,
    "title" string   NOT NULL,
    "host_id" int   NOT NULL,
    "host_name" string   NOT NULL,
    "host_photo" string   NOT NULL,
    "image_url" string   NOT NULL,
    "adults" int   NOT NULL,
    "reviews_count" int   NOT NULL,
    "name" string   NOT NULL,
    "property_type" string   NOT NULL,
    CONSTRAINT "pk_properties" PRIMARY KEY (
        "property_id"
     )
);

CREATE TABLE "booking" (
    "id" int   NOT NULL,
    "guest_id" int   NOT NULL,
    "property_id" int   NOT NULL,
    "checkin" date   NOT NULL,
    "checkout" date   NOT NULL,
    "price" float   NOT NULL,
    CONSTRAINT "pk_booking" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "users" (
    "id" int   NOT NULL,
    "email" string   NOT NULL,
    "first_name" string   NOT NULL,
    "last_name" string   NOT NULL,
    "username" string   NOT NULL,
    "password" text   NOT NULL,
    CONSTRAINT "pk_users" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "amenities" (
    "id" int   NOT NULL,
    -- indoor, outdoor, area, water, kosher
    "type" string   NOT NULL,
    "name" text   NOT NULL,
    CONSTRAINT "pk_amenities" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "house_amenities" (
    "property" int   NOT NULL,
    "amenities_id" int   NOT NULL
);

CREATE TABLE "available_dates" (
    "property_id" int   NOT NULL,
    "start_date" date   NOT NULL,
    "end_date" date   NOT NULL
);

CREATE TABLE "images" (
    "id" int   NOT NULL,
    "property_id" int   NOT NULL,
    "image_url" string   NOT NULL,
    CONSTRAINT "pk_images" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "favorites" (
    "user_id" int   NOT NULL,
    "property_id" int   NOT NULL
);

CREATE TABLE "reviews" (
    "id" int   NOT NULL,
    "property_id" int   NOT NULL,
    "first_name" string   NOT NULL,
    "profile_picture" string   NOT NULL,
    "rating" int   NOT NULL,
    "comments" string   NOT NULL,
    CONSTRAINT "pk_reviews" PRIMARY KEY (
        "id"
     )
);

ALTER TABLE "properties" ADD CONSTRAINT "fk_properties_host_id" FOREIGN KEY("host_id")
REFERENCES "users" ("id");

ALTER TABLE "booking" ADD CONSTRAINT "fk_booking_guest_id" FOREIGN KEY("guest_id")
REFERENCES "users" ("id");

ALTER TABLE "booking" ADD CONSTRAINT "fk_booking_property_id" FOREIGN KEY("property_id")
REFERENCES "properties" ("property_id");

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

