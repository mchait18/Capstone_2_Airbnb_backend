"use strict";

const BASE_URL = "https://airbnb19.p.rapidapi.com/api"
const axios = require("axios");
const { API_SECRET_KEY } = require("../config");

class AirbnbApiService {
    static async searchProperties(
        location = "United States",
        category = "all",
        adults = 1,
        checkin = "2024-05-13",
        checkout = "2024-05-20",
        priceMin = 0,
        priceMax = 100000,
        minBedrooms = 0,
        minBeds = 0,
        minBathrooms = 0,
        // property_type = ["all"]
    ) {
        const response = await axios({
            url: `${BASE_URL}/v1/searchPropertyByLocationV2`,
            method: "GET",
            params: {
                location, category, adults, checkin, checkout, priceMin,
                priceMax, minBedrooms, minBeds, minBathrooms,
                // property_type
            },
            headers: { 'X-RapidAPI-Key': API_SECRET_KEY }
        });
        return response.data.data.list
    }

    static async getProperty(propertyId) {
        try {
            const response = await axios({
                url: `${BASE_URL}/v2/getPropertyDetails`,
                method: "GET",
                params: { propertyId },
                headers: { 'X-RapidAPI-Key': API_SECRET_KEY }
            });
            return response.data
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    static async getPropertyReviews(propertyId) {
        try {
            const response = await axios({
                url: `${BASE_URL}/v1/getPropertyReviews`,
                method: "GET",
                params: { propertyId },
                headers: { 'X-RapidAPI-Key': API_SECRET_KEY }
            });
            return response.data
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    static async getBookingPrice({ propertyId, checkIn, checkOut, adults }) {
        const response = await axios({
            url: `${BASE_URL}/v1/getPropertyCheckoutPrice`,
            method: "GET",
            params: { propertyId, checkIn, checkOut, adults },
            headers: { 'X-RapidAPI-Key': API_SECRET_KEY }
        });
        console.log("in BookingPrice, response is ", response)
        return response.data
    }
}
module.exports = AirbnbApiService;