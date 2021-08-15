import { Controller } from "stimulus"
import StimulusReflex from 'stimulus_reflex'
import places from 'places.js';


export default class extends Controller {
  static targets = ['pickup', 'drop', 'form', 'switchable', 'submit', 'address', 'details']

  connect() {
    StimulusReflex.register(this)
  }

  beforeReflex() {
    if (this.hasFormTarget) {
      this.formTarget.classList.add('pointer-events-none')
    }
  }

  beforeCreate() {
    this.submitTarget.value = "Patienter"
    this.submitTarget.disabled = true
    this.submitTarget.classList.remove('btn-bici')
    this.submitTarget.classList.add('btn-bici-wait')
  }

  finalizeReflex() {
    this.initAddressAutoComplete();
    if (this.pickupTarget.value != "") {
      this.dropTarget.disabled = false
      // this.dropTarget.classList.remove('bg-gray-200')
    }
    if (this.pickupTarget.value != "" && this.dropTarget.value != "") {
      this.detailsTarget.disabled = false
      // this.detailsTarget.classList.remove('bg-gray-200')
    }
  }

  afterDistance() {
  }

  switch() {
    this.switchableTargets.forEach((target) => {
      target.classList.toggle ('hidden');
    });
  }

  exit = () => {
    this.formTarget.classList.add("hidden");
  }

  initAddressAutoComplete = () => {
    if (this.hasAddressTarget) {
      console.log("step1")
      this.addressTargets.forEach((addressInputs) => {
        const address = places({
          container: addressInputs,
        });
        address.on('change', ()=> {
          console.log(this.dropTarget.value)
          if (this.dropTarget.value != "") {
            console.log("step2")
            // this.stimulate('Delivery#distance')
          }
        });
      })
    }
  }
}
