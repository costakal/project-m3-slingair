"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const {
  handleFlight,
  handleAllFlightNums,
  handleBookings,
  handleSeeBookings,
  handleConfirmationPage,
  handleViewExisistingReservation,
} = require("./handlers");

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints
  .get("/flights/:flightId", handleFlight)
  .get("/all-flight-numbers", handleAllFlightNums)

  .get("/reservations", handleSeeBookings)
  .post("/reservations", handleBookings)
  .get("/reservations/:id", handleConfirmationPage)

  .get("reservations/view-confirmation/:id", handleViewExisistingReservation)

  .use((req, res) => res.send("Not Found"))
  .listen(8000, () => console.log(`Listening on port 8000`));

// find your booking by typing in email.
// right now the form returns a query paramter... why?
// brings you to the confirmation page with relevant information (like confirmation page)
// if the email does not exist in the system, it alerts you, the user doesn't exist.
