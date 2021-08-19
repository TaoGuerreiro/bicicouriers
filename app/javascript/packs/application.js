require("turbolinks").start()
require("channels")
import '../stylesheets/application.scss';
import "controllers";
import gtag from '../src/analytics';

document.addEventListener("turbolinks:load", () => {
  gtag();
})
