import { Controller } from "stimulus"
import StimulusReflex from 'stimulus_reflex'
import places from 'places.js';


export default class extends Controller {
  static targets = ['pickup', 'drop', 'form', 'switchable', 'submit', 'address']

  connect() {
    StimulusReflex.register(this)
    // this.initAddressAutoComplete();
  }

  // beforeReflex() {
  //   if (this.hasFormTarget) {
  //     this.formTarget.classList.add('pointer-events-none')
  //   }
  // }

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
      this.addressTargets.forEach((input) => {
        const address = places({
          container: input,
        });
        address.on('change', ()=> {
        });
      })
    }
  }

  // beforeCreate() {
  //   this.submitTarget.value = "Patienter"
  //   this.submitTarget.disabled = true
  //   this.submitTarget.classList.remove('btn-bici')
  //   this.submitTarget.classList.add('btn-bici-wait')
  // }

  // afterReflex() {
  //   this.initAddressAutoComplete();
  // }
}
