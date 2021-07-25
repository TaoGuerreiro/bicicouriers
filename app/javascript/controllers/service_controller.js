import { Controller } from "stimulus"
import HorizontalScroll from '@oberon-amsterdam/horizontal';

export default class extends Controller {
  static targets = [ 'card' ]


    connect() {
      console.log('Connexion du controller de service')
      console.log(this.cardTargets[0])
      this.cardTargets[0].classList.remove('hidden')
      this.cardTargets[0].classList.remove('opacity-0')
      this.cardTargets[0].classList.add('active')
      this.cardTargets[1].classList.add('translate-x-96', '-translate-y-16')
    }

    next() {
      const active = document.querySelector('.active')
      if (active.nextElementSibling == null) {
        return
      }
      active.nextElementSibling.classList.remove('hidden')
      setTimeout(() => {
        active.nextElementSibling.classList.remove('opacity-0')
        active.nextElementSibling.classList.remove('translate-x-96', '-translate-y-16')
        active.nextElementSibling.classList.add('active')
        active.classList.add('-translate-x-96', 'translate-y-16')
        active.classList.add('opacity-0')
        active.classList.remove('active')
      }, 200);
      setTimeout(() => {
        active.classList.add('hidden')
      }, 500);
      if (active.nextElementSibling.nextElementSibling == null) {
        return
      }
      active.nextElementSibling.nextElementSibling.classList.add('translate-x-96','opacity-0', '-translate-y-16')
    }

    previous() {
      const active = document.querySelector('.active')
      if (active.previousElementSibling == null) {
        return
      }
      active.previousElementSibling.classList.remove('hidden')
      setTimeout(() => {
        active.previousElementSibling.classList.remove('opacity-0')
        active.previousElementSibling.classList.remove('-translate-x-96', 'translate-y-16')
        active.previousElementSibling.classList.add('active')
        active.classList.add('translate-x-96', '-translate-y-16')
        active.classList.add('opacity-0')
        active.classList.remove('active')
      }, 200);
      setTimeout(() => {
        active.classList.add('hidden')
      }, 500);
      if (active.previousElementSibling.previousElementSibling == null) {
        return
      }
      active.previousElementSibling.previousElementSibling.classList.add('-translate-x-96', 'opacity-0', 'translate-y-12')
    }
}
