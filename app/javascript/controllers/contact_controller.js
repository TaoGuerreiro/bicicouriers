import { Controller } from "stimulus"
import StimulusReflex from 'stimulus_reflex'


export default class extends Controller {
  static targets = []

  connect() {
    console.log('contact')
    StimulusReflex.register(this)
  }

}
