import { Controller } from "stimulus"
import mapboxgl from '!mapbox-gl';
// import MapboxDirections from "@mapbox/mapbox-gl-directions";
import 'mapbox-gl/dist/mapbox-gl.css';

export default class extends Controller {
  static targets = [ 'map', 'pickup', 'drop', 'address']

  connect() {
    this.map= null
    this.initMapbox()
  }

  initMapbox() {
    const mapElement = document.getElementById('map');
    mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [-1.554811, 47.214882], // starting position
      zoom: 12
    });
  }

  getCoordinates(input) {
    const mapElement = document.getElementById('map');
    mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
    // const coordinates =
    return new Promise(resolve => {
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json?access_token=${mapboxgl.accessToken}`)
        .then(response => response.json())
        .then((data) => {
          // console.log(data.features[0].geometry.coordinates)
          resolve(data.features[0].geometry.coordinates)
          // console.log(data.features[0].geometry.coordinates)

        });
    })
  }

  async noname(event) {
    if (this.pickupTarget.value != '' && this.dropTarget.value != ''  ) {
      this.initMapbox();

      const start = await this.getCoordinates(this.pickupTarget.value)
      const end =   await this.getCoordinates(this.dropTarget.value)

      this.map.on('load', () => {

        this.getRoute(start, end) // tracé entre start et end

        this.map.addLayer({
          id: 'pickup',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: start
                  }
                }
              ]
            }
          },
          paint: {
            'circle-radius': 10,
            'circle-color': '#3887be'
          }
        });
        this.map.addLayer({
          id: 'drop',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: end
                  }
                }
              ]
            }
          },
          paint: {
            'circle-radius': 10,
            'circle-color': '#3887be'
          }
        });
      })

      // this.map.flyTo({
      //   center: end, //center viewport on clicked feature
      //   zoom: this.map.getZoom() + 1  //add 1 to current zoom level
      // });
    }
  }

  async getRoute(start, end) {

    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };
    // if the route already exists on the map, we'll reset it using setData
    if (this.map.getSource('route')) {
      this.map.getSource('route').setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
      console.log(geojson)
      this.flyTo(geojson)
    }
  }

  flyTo(geojson) {

    const coordinates = geojson.geometry.coordinates;

    const bounds = new mapboxgl.LngLatBounds(
      coordinates[0],
      coordinates[0]
    );

    for (const coord of coordinates) {
      bounds.extend(coord);
    }

    this.map.fitBounds(bounds, {
      padding: 40
    });
  }

}
