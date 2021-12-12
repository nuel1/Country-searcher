let DATA;

(function () {
  "use strict";

  async function RESTData() {
    try {
      let response = await fetch("https://restcountries.com/v2/all");
      let data = await response.json();
      return data;
    } catch (e) {
      document.write(`<h1>Failed to fetch</h1>`);
      console.error(e);
    }
  }
  if (localStorage.getItem("REST")) {
    DATA = JSON.parse(localStorage.getItem("REST"));
  } else {
    RESTData().then((data) => {
      //Get API Data and store in browser's local storage
      localStorage.setItem("REST", JSON.stringify(data));
      DATA = JSON.parse(localStorage.getItem("REST"));
    });
  }
})();
