require("turbolinks").start()
require("channels")
import '../stylesheets/application.scss';
import "controllers";
import gtatg from "src/analytics";
import gtag from '../src/analytics';

document.addEventListener("turbolinks:load", () => {
  gtag();
})
