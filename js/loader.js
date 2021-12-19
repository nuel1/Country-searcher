"use strict";
const homeSection = document.querySelector(".content-tag--home");
const aboutSection = document.querySelector(".content-tag--about");
const content_home = document.querySelector(".tag--home");
const homeDataWrapper = document.querySelector(".list--countries");
const content_about = document.querySelector(".tag--about");
const about_preloader = document.querySelector(
  ".about-content-preloader-wrapper"
);
const aboutDataWrapper = document.querySelector(".country--about");
const preloader = document.querySelector(".page-preloader");
const loadingStates = {
  contentIsLoaded: false,
  contentIsLoading: false,
  pageIsLoaded: false,
};
const observerState = { observe: true };

function loadPage(n) {
  function pageProgress() {
    const i = setInterval(function () {
      if (loadingStates.pageIsLoaded) {
        clearInterval(i);
        viewPage();
      }
    }, 0);

    const j = setInterval(function () {
      if (loadingStates.contentIsLoading) {
        clearInterval(j);
        dataPreloader();
      }
    }, 0);
  }

  function viewPage() {
    if (n === 1) {
      if (homeSection.classList.contains("hidden--js")) {
        homeSection.classList.remove("hidden--js");
      }
      if (!aboutSection.classList.contains("hidden--js")) {
        aboutSection.classList.add("hidden--js");
      }
    } else {
      if (aboutSection.classList.contains("hidden--js")) {
        aboutSection.classList.remove("hidden--js");
      }
      if (!homeSection.classList.contains("hidden--js")) {
        homeSection.classList.add("hidden--js");
      }
    }
  }

  pageProgress();
}

function dataPreloader() {
  if (homeSection.classList.contains("hidden--js")) {
    if (!content_home.classList.contains("hidden--js")) {
      content_home.classList.add("hidden--js");
    }
    if (!aboutDataWrapper.classList.contains("hidden--js")) {
      aboutDataWrapper.classList.add("hidden--js");
    }

    content_about.classList.remove("hidden--js");
    about_preloader.classList.remove("hidden--js");
  } else {
    if (!content_about.classList.contains("hidden--js")) {
      content_about.classList.add("hidden--js");
    }
    if (!about_preloader.classList.contains("hidden--js")) {
      about_preloader.classList.add("hidden--js");
    }

    content_home.classList.remove("hidden--js");
    homeDataWrapper.innerHTML = "";

    for (let i = 0; i < 4; i++) {
      homeDataWrapper.innerHTML += `<li class="home-content-preloader-wrapper"><div class="wrapper--image-placeholder"><div class="image-placeholder"></div></div><div class="wrapper--content"><div class="content"></div><div class="content"></div><div class="content"></div></div></li>`;
    }
  }
  loadingStates.contentIsLoaded = false;
}

function removeDataPreloader() {
  if (content_home.classList.contains("hidden--js")) {
    about_preloader.classList.add("hidden--js");
    aboutDataWrapper.classList.remove("hidden--js");
  } else {
    homeDataWrapper.innerHTML = "";
  }
  loadingStates.contentIsLoaded = true;
}

/**
 *
 * @param {Object} data
 * @param {Function} f
 */

function dataIsLoaded(data, f) {
  setTimeout(function () {
    removeDataPreloader();
    if (data instanceof Array) f(data);
    else f(data);
  }, 10000);
}

// Hide all pages when a new page loads(animation loader)
function hideAllPage() {
  if (!homeSection.classList.contains("hidden--js")) {
    homeSection.classList.add("hidden--js");
    content_home.classList.add("hidden--js");
  }
  if (!aboutSection.classList.contains("hidden--js")) {
    aboutSection.classList.add("hidden--js");
    content_about.classList.add("hidden--js");
  }
}

function runPreloader() {
  if (loadingStates.pageIsLoaded) loadingStates.pageIsLoaded = false;
  if (loadingStates.contentIsLoading) loadingStates.contentIsLoading = false;

  let loaderCount = 0;

  function load() {
    if (loaderCount == 50) loadingStates.pageIsLoaded = true;
    if (loaderCount == 99.5) {
      loadingStates.contentIsLoading = true;
      clearInterval(loading);
      preloader.style.width = "0";
    }
    loaderCount += 0.5;
    preloader.style.width = `${loaderCount}%`;
  }
  const loading = setInterval(load, 15);
  hideAllPage();
}

function loadOnScroll(data) {
  let observer;
  const options = {
    root: null,
    threshold: 1,
    rootMargin: "400px",
  };

  function loadContent(entries) {
    const [entry] = entries;
    if (entry.isIntersecting && loadingStates.contentIsLoaded) {
      //load content for every intersection
      function content(n) {
        let currLen = homeDataWrapper.children.length;
        let currIndex = data.indexOf(data[currLen]);
        let template;
        if (currLen < data.length) {
          if (currLen + n > data.length) {
            const remainder = data.length - currLen;
            for (let i = 0; i < remainder; i++) {
              template = homeTemplate(data[currIndex]);
              homeDataWrapper.innerHTML += template;
              currIndex += 1;
            }
          } else {
            for (let i = 0; i < n; i++) {
              template = homeTemplate(data[currIndex]);
              homeDataWrapper.innerHTML += template;
              currIndex += 1;
            }
          }
        }
      }
      content(8);
    }

    if (!observerState.observe) observer.disconnect();
  }
  observer = new IntersectionObserver(loadContent, options);
  const element = document.querySelector(".observer");

  observer.observe(element);
}

function homeTemplate(country) {
  return `<li class="card">
  <div class="card--upper-section">
  <img src="${country["flags"]["png"]}">
  </div>
  <div class="card--lower-section">
    <div class="card-lower-section-content">
      <div class="card--title">
        <h3>${country["name"]}</h3>
      </div>
      <div class="card--info">
        <ul class="info-list">
          <li>
            <div class="info">
              <span class="info-name">Population:</span>
              <span class="info-value">${country["population"]}</span>
            </div>
          </li>
          <li>
            <div class="info">
              <span class="info-name">Region:</span>
              <span class="info-value">${country["region"]}</span>
            </div>
          </li>
          <li>
            <div class="info">
              <span class="info-name">Capital:</span>
              <span class="info-value">${country["capital"]}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</li>`;
}

function dataInfo(country) {
  (function (...arg) {
    arg.forEach((f) => f());
  })(getFlag, getName, getBorderCountries, getInfo);

  function getFlag() {
    const img = document.querySelector(".flag--js");
    img.src = country["flags"]["svg"];
  }

  function getName() {
    const h1 = document.querySelector(".name--js");
    h1.textContent = `${country["name"]}`;
  }

  function getBorderCountries() {
    const btnWrapper = document.querySelector(".tag-container");
    btnWrapper.innerHTML = "";

    for (let key in country) {
      if (key === "borders") {
        country[key].forEach((val) => {
          DATA.forEach((data) => {
            if (data["alpha3Code"] === val)
              btnWrapper.innerHTML += `<a href="">${data["name"]}</a>`;
          });
        });
      }
    }
  }

  function getInfo() {
    const infoTitles = [
      ["native name", "population", "region", "sub region", "capital"],
      ["top level domain", "currencies", "languages"],
    ];
    const infoCol1 = document.querySelector(".country-info--col-1");
    const infoCol2 = document.querySelector(".country-info--col-2");
    const parentCol1 = infoCol1.childNodes[1];
    const parentCol2 = infoCol2.childNodes[1];

    displayInfos(infoTitles[0], parentCol1);
    displayInfos(infoTitles[1], parentCol2);
  }

  function displayInfos(infos, parent) {
    parent.innerHTML = "";

    infos.forEach((element) => {
      let title = "",
        value;
      let replaceWith = /\s/.test(element)
        ? element.replace(/\s/g, "")
        : element;
      let regexexp = new RegExp("\\b" + replaceWith + "\\b", "i");
      for (let key in country) {
        if (key.match(regexexp)) {
          if (/\s/.test(element)) {
            title = element
              .split(" ")
              .reduce(
                (obj, str) =>
                  obj.concat(
                    str.replace(`${str[0]}`, `${str[0]}`.toUpperCase())
                  ),
                []
              )
              .join(" ");
          } else {
            title = element.replace(
              `${element[0]}`,
              `${element[0]}`.toUpperCase()
            );
          }
          if ("object" === typeof country[key]) {
            country[key].forEach((item) =>
              "object" === typeof item ? (value = item["name"]) : (value = item)
            );
          } else value = country[key];
          parent.innerHTML += `<li><span class='info-name'>${title}:</span><span class='info-value'>${value}</span></li>`;
        }
      }
    });
  }
}

function loadDocument() {
  if (!observerState.observe) observerState.observe = true;
  runPreloader();
  loadPage(1);
  dataIsLoaded(DATA, loadOnScroll);
}

(function () {
  const i = setInterval(function () {
    // Check if data is cached and load the data to the page
    if (DATA) {
      clearInterval(i);
      loadDocument();
    }
  }, 0);
})();
