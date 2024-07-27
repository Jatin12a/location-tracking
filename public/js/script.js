const socket = io(); // Ensure this line is executed after the socket.io script is loaded

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.log(error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }
    );
}

const map = L.map('map').setView([0, 0], 15);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution : "OpenStreetMap"
}).addTo(map)

const markers = {};


socket.on("receive-location" , (data)=>{
    const {id, latitude, longitude } = data;
    map.setView([latitude,longitude],15);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map)
    }
})

socket.on("user-gone",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id];
    }
})