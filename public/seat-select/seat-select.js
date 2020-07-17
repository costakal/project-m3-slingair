const flightInput = document.getElementById("flight");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");
const emailInput = document.getElementById("email-entry");

let selection = "";

let selectedFlight = [];

const renderSeats = (seatInfo) => {
  seatsDiv.innerHTML = "";
  document.querySelector(".form-container").style.display = "block";

  const alpha = ["A", "B", "C", "D", "E", "F"];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement("ol");
    row.classList.add("row");
    row.classList.add("fuselage");
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement("li");

      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;

      const individualSeat = seatInfo.find((info) => {
        return seatNumber === info.id;
      });
      if (individualSeat.isAvailable) {
        seat.innerHTML = seatAvailable;
      } else {
        seat.innerHTML = seatOccupied;
      }
      row.appendChild(seat);
    }
  }

  let seatMap = document.forms["seats"].elements["seat"];
  seatMap.forEach((seat) => {
    seat.onclick = () => {
      selection = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove("selected");
        }
      });
      document.getElementById(seat.value).classList.add("selected");
      document.getElementById("seat-number").innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const toggleFormContent = (event) => {
  const defaultOption = document.getElementById("defaultOption");
  defaultOption.disabled = true;
  const flightNumber = flightInput.value;
  fetch("/all-flight-numbers")
    .then((res) => res.text())
    .then((data) => {
      const allFlights = JSON.parse(data).allFlightNumbers;
      if (
        allFlights.find((flight) => {
          return flight === flightNumber;
        })
      ) {
        fetch(`/flights/${flightNumber}`)
          .then((res) => res.text())
          .then((data) => {
            const parsedData = JSON.parse(data);
            renderSeats(parsedData.currentFlight);
          });
      } else {
        alert("The Flight # does not exist");
      }
    });
};

const handleConfirmSeat = (event) => {
  event.preventDefault();
  fetch("/reservations", {
    method: "POST",
    body: JSON.stringify({
      flight: document.getElementById("flight").value,
      seat: selection,
      givenName: document.getElementById("givenName").value,
      surname: document.getElementById("surname").value,
      email: document.getElementById("email").value,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.href = `/confirmed?id=${data.id}`;
    });
};

const handleConfirmEmail = (event) => {
  event.preventDefault();
  const email = document.getElementById("check-email").value;
  window.location.href = `/confirmed?id=${email}`;
};

fetch("/all-flight-numbers")
  .then((res) => res.json())
  .then((data) => {
    data.allFlightNumbers.forEach((flightId) => {
      const option = document.createElement("option");
      option.classList.add("flight-option");
      option.innerText = flightId;
      option.value = flightId;

      flightInput.appendChild(option);
    });
  });

flightInput.addEventListener("change", toggleFormContent);
