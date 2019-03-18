function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

let polylines = []
let markers = []

let config = {
    apiKey: "AIzaSyDDCMIi7GgKZX9VMDBoMA_ylYXCfuHcZNY",
    authDomain: "fly-testing.firebaseapp.com",
    databaseURL: "https://fly-testing.firebaseio.com",
    projectId: "fly-testing",
    storageBucket: "fly-testing.appspot.com",
    messagingSenderId: "524895631634"
};
firebase.initializeApp(config);

let ref = firebase.firestore().collection('flights')

ref.onSnapshot(function(querySnapshot) {
    let flights = []
    
    querySnapshot.forEach(function(doc) {
        flights.push({...doc.data(), id: doc.id})
    })

    let flightsDiv = document.getElementById('flights')
    console.log(flights)
    
    flightsDiv.innerHTML = flights.map((flight) => `
        <div class="flightRow">
            <div class="al">
                <img class="airlineLogoImage"
                    src=${'airline' in flight?`https://res.cloudinary.com/prathammehta/image/upload/v1549286043/fly/flight_logos/${flight.airline.iata}.png`:`https://res.cloudinary.com/prathammehta/image/upload/e_colorize:100/v1552927223/fly/web_view_icons/tailWing.png`} />
            </div>

            <div class="dep">
                <div class="depAirportCode">${flight.departureAirport.iata_code}</div>
                <div class="departureMunicipality">${flight.departureAirport.municipality}</div>
                <div class="departureMunicipality">${moment.tz( new Date(flight.departureTimestamp.seconds * 1000), flight.departureTimeZone).format('D MMM, YYYY')}</div>
            </div>

            <div class="fldet">
                <img class="flightHorizontal" src="./images/flightHorizontal.png" />
                <div class="flightNumberText">${flight.flightNumber?flight.flightNumber:''}</div>
                <div class="flightDetailText">${'airline' in flight?flight.airline.airline:''}</div>
            </div>

            <div class="arr">
                <div class="depAirportCode">${flight.arrivalAirport.iata_code}</div>
                <div class="departureMunicipality">${flight.arrivalAirport.municipality}</div>
                <div class="departureMunicipality">${moment.tz( new Date(flight.arrivalTimestamp.seconds * 1000), flight.arrivalTimeZone).format('D MMM, YYYY')}</div>
            </div>
        </div>
    `).join('\n')

    polylines.forEach(polyline => polyline.setMap(null))
    polylines = []

    markers.forEach(marker => marker.setMap(null))
    markers = []

    let markerImage = {
        url: 'https://res.cloudinary.com/prathammehta/image/upload/v1552924640/fly/web_view_icons/PrimaryMarkerCircle.png',
        size: new google.maps.Size(100, 100),
        scaledSize: new google.maps.Size(10, 10),
        anchor: new google.maps.Point(5, 5),
      };
    
    let bounds = new google.maps.LatLngBounds()

    flights.forEach(flight => {
        let marker1 = new google.maps.Marker({
            position:{lat:flight.arrivalAirport.latitude_deg, lng:flight.arrivalAirport.longitude_deg},
            map:map,
            icon:markerImage
        })

        let marker2 = new google.maps.Marker({
            position:{lat:flight.departureAirport.latitude_deg, lng:flight.departureAirport.longitude_deg},
            map:map,
            icon:markerImage
        })

        markers.push(marker1)
        markers.push(marker2)

    })

    polylines = flights.map(flight => {
        bounds.extend({lat:flight.arrivalAirport.latitude_deg, lng:flight.arrivalAirport.longitude_deg})
        bounds.extend({lat:flight.departureAirport.latitude_deg, lng:flight.departureAirport.longitude_deg})
        return new google.maps.Polyline({
            path: [
                {lat:flight.arrivalAirport.latitude_deg, lng:flight.arrivalAirport.longitude_deg},
                {lat:flight.departureAirport.latitude_deg, lng:flight.departureAirport.longitude_deg}
            ],
            geodesic:true,
            strokeColor: '#F5A622',
            strokeWidth:3,
            map:map})
    })

    map.fitBounds(bounds)
}, function(error) {
    console.log('Error getting flights: ', error)
})


