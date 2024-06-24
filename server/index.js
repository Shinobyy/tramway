const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());

var GtfsRealtimeBindings = require("gtfs-realtime-bindings");
var request = require("request");

var requestSettings = {
  method: "GET",
  url: "https://bdx.mecatran.com/utw/ws/gtfsfeed/vehicles/bordeaux?apiKey=opendata-bordeaux-metropole-flux-gtfs-rt",
  encoding: null,
};

var gtfsData = [];

// @GET 'api/positions' (autoexecute every 500 ms)
function fetchGtfsData() {
  request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
      gtfsData = feed.entity
        .filter((entity) => {
          return !(
            entity.vehicle &&
            entity.vehicle.vehicle &&
            /ineo-bus/.test(entity.vehicle.vehicle.id)
          );
        })
        .map((entity) => entity);
    } else {
      console.error("Erreur lors de la requête GTFS:", error);
    }
  });
}

setInterval(fetchGtfsData, 500);

app.get("/", (req, res) => {
  res.json(gtfsData);
});

app.listen(port, () => {
  console.log("Server-side listening on port " + port);
});
