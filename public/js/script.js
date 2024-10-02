const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-loca", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "harsh kavaiya",
}).addTo(map);

// Custom icon definition
const customIcon = L.icon({
  iconUrl: "images/markers.png", // Path to your custom marker image
  iconSize: [70, 70], // Size of the marker
  iconAnchor: [19, 38], // The point of the icon which will correspond to marker's location
  popupAnchor: [0, -38], // The point from which the popup should open relative to the iconAnchor
});

const markers = {};

socket.on("receive-loca", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude], { icon: customIcon }).addTo(
      map
    );
  }
});

socket.on("user-exit", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
