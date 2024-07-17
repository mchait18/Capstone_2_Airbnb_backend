"use strict";

/** Route for home. */

const express = require("express");
const router = new express.Router();

router.get("/", async function (req, res, next) {
    try {
        return res.status(200)
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
