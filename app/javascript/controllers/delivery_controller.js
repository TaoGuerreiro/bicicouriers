import { Controller } from "stimulus"
import StimulusReflex from 'stimulus_reflex'
import places from 'places.js';


export default class extends Controller {
  static targets = ['pickup', 'drop', 'form', 'switch', 'switchable', 'submit', 'field']

  connect() {
    StimulusReflex.register(this)
  }



  beforeReflex() {
    // this.formTarget.classList.add('pointer-events-none')
  }

  switch() {
    console.log(this.switchTarget)
    this.switchableTargets.forEach((target) => {
      target.classList.toggle ('hidden');
    });
  }

  afterNew() {
    this.displayDirection();
  }

  abort = () => {
    this.formTarget.classList.add("hidden");
  }

  finalizeDistance() {
    this.displayDirection();
  }

  save_errorSuccess() {
    // this.formTarget.classList.add('hidden')
  }

  displayDirection = () => {
  //   const pickupInput = document.getElementById('delivery_pickups_attributes_0_address');
  //   const dropInput = document.getElementById('delivery_drops_attributes_0_address');

  //   const directionsRenderer = new google.maps.DirectionsRenderer();
  //   const directionsService = new google.maps.DirectionsService();
  //   const map = new google.maps.Map(document.getElementById("map"), {
  //     zoom: 14,
  //     center: { lat: 47.217715, lng: -1.558234 },
  //   });
  //   directionsRenderer.setMap(map);
  //   calculateAndDisplayRoute(directionsService, directionsRenderer);

  // function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  //   directionsService
  //     .route({
  //       origin: pickupInput,
  //       destination: dropInput,
  //       travelMode: google.maps.DirectionsTravelMode.WALKING,
  //     })
  //     .then((response) => {
  //       directionsRenderer.setDirections(response);
  //     })
  //     .catch((e) => window.alert("Directions request failed due to " + status));
  // }
  }

  initAddressAutoComplete = () => {
    const addressInput = document.querySelectorAll('.address-input')
    if (addressInput) {
      addressInput.forEach((input) => {
        const address = places({
          container: input,
        });
        address.on('change', ()=> {
          // this.stimulate()
        });
      })
    }
  }

  beforeCreate() {
    this.submitTarget.value = "Validation"
    this.submitTarget.disabled = true
  }

  afterCreate() {
    console.log('successsss')
    this.formTarget.classList.add('hidden')
  }

  afterReflex() {
    this.initAddressAutoComplete();
  }

}
