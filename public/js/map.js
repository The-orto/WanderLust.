mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: (coordinates), // starting position [lng, lat]
  zoom: 10, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <h4>${Title}</h4><p>Exact Location will be Provided after booking</p>`)
  )
  .addTo(map);

  
  


