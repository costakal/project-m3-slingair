const { flights } = require("./test-data/flightSeating");
const { reservations } = require("./test-data/reservations");
const { v4: uuidv4 } = require("uuid");

const handleFlight = (req, res) => {
  const flightNumber = req.params.flightId;
  const currentFlight = flights[flightNumber];
  res.status(200).send({ currentFlight });
};

const handleAllFlightNums = (req, res) => {
  const allFlightNumbers = Object.keys(flights);
  res.status(200).send({ allFlightNumbers });
};

const handleSeeBookings = (req, res) => {
  res.status(200).json(reservations);
};

const handleBookings = (req, res) => {
  const newBooking = { id: uuidv4(), ...req.body };
  reservations.push(newBooking);
  res.status(201).json(newBooking);
};

const handleViewConfirmation = (req, res) => {
  const id = req.params.id;
  const reservation = reservations.find((reservation) => {
    return reservation.id === id || reservation.email === id;
  });
  res.status(200).json(reservation);
};

module.exports = {
  handleFlight,
  handleAllFlightNums,
  handleSeeBookings,
  handleBookings,
  handleViewConfirmation,
};
