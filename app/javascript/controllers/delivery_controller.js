import { Controller } from "stimulus"
import StimulusReflex from 'stimulus_reflex'
import places from 'places.js';


export default class extends Controller {
  static targets = ['pickup', 'drop', 'form', 'switchable', 'submit']

  connect() {
    StimulusReflex.register(this)
  }

  beforeReflex() {
    if (this.hasFormTarget) {
      this.formTarget.classList.add('pointer-events-none')
    } else {
      return
    }
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
    const addressInput = document.querySelectorAll('.address-input')
    if (addressInput) {
      addressInput.forEach((input) => {
        const address = places({
          container: input,
        });
        address.on('change', ()=> {
        });
      })
    }
  }

  beforeCreate() {
    this.submitTarget.value = "Patientez"
    this.submitTarget.disabled = true
    this.submitTarget.classList.remove('btn-bici')
    this.submitTarget.classList.add('btn-bici-wait')
  }

  afterReflex() {
    this.initAddressAutoComplete();
  }
}
