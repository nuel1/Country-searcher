"use strict";

// Variable !global
// ___________________
const page_container = document.querySelector(".wrapper--page");
const searchbox_shell = document.querySelector(".search-box--shell");
const search_field = document.querySelector(".search-box--search-field input");
const search_icon_box = document.querySelector(".search-box--icon-box");
const dropdown_container = document.querySelector(".drop-down-list");
const toggle_box = document.querySelector(".drop-box--title-section");
const mode_togglebox = document.querySelector(".header-content--theme");
const ul_country_list = document.querySelector(".list--countries");
const drop_down_title = document.querySelector(".drop-box--title span");
const ul_dropdown = document.querySelector(".drop-down-list");
const back_navigator = document.querySelector(".navigator--btn");
const a_tagContainer = document.querySelector(".tag-container");

// Reverting back to previously opened pages:
// First we initialise an object varible type
// that keeps record of those pages visited...
const history = [];

// Search box expand & shrink animation
// ______________________________________
const shrink = () =>
  searchbox_shell.classList.replace("expand--js", "shrink--js");

const expand = () => {
  if (searchbox_shell.classList.contains("input--error-js"))
    searchbox_shell.classList.remove("input--error-js");
  searchbox_shell.classList.replace("shrink--js", "expand--js");
};

search_field.addEventListener("focus", expand);
search_field.addEventListener("blur", shrink);

// Drop down animation
//____________________
const closeDropBox = () => {
  dropdown_container.classList.add("hidden--js");
  dropdown_container.style.height = "50px";
};

function openDropBox(e) {
  e.stopPropagation();
  if (dropdown_container.classList.contains("hidden--js")) {
    dropdown_container.classList.remove("hidden--js");
    let currentHeight = 50;
    const mainHeight = 250;
    const interval = setInterval(() => {
      if (currentHeight >= mainHeight) {
        clearInterval(interval);
        return;
      }
      currentHeight += 12;
      dropdown_container.style.height = `${currentHeight}px`;
    }, 0);
  } else {
    closeDropBox();
  }
}

toggle_box.addEventListener("click", openDropBox);
page_container.addEventListener("click", closeDropBox);

// Light mode & Dark mode
//_______________________
const modes = {
  tag: document.createElement("style"),
  light: [
    `* {color: hsl(200, 15%, 8%);}.image-placeholder,.content{background: #e4e6eb;}body,.tag--link,.search-box,.drop-down-list,.navigator--btn,.top-header-wrapper,.card--lower-section,.drop-box--title-section {background: hsl(0, 0%, 100%)}.top-header-wrapper,.search-box,.drop-box--title-section,.drop-down-list,.card,.navigator--btn,.tag-container a {box-shadow: 0 0px 10px rgba(182, 182, 182, 0.562)}`,
  ],
  dark: [
    `* {color: hsl(0, 0%, 100%);}.image-placeholder,.content{background: #e4e6eb6c;}body{background: hsl(207, 26%, 17%)}.tag--link,.search-box,.drop-down-list,.navigator--btn,.top-header-wrapper,.card--lower-section,.drop-box--title-section {background: hsl(209, 23%, 22%)}.top-header-wrapper,.search-box,.drop-box--title-section,.drop-down-list,.card,.navigator--btn,.tag-container a {box-shadow: 0 0px 10px hsla(206, 25%, 11%, 0.596)}`,
  ],
};

function loadModeState() {
  // Store last mode(dark or light) state in browser storage

  //Create a mode storage if it doesn't exist
  if (!localStorage.getItem("mode"))
    localStorage.setItem(
      "mode",
      JSON.stringify({ modeState: "light", mode: modes.light[0] })
    );

  // Get the mode storage data and attach its value to document body class
  const modeObject = JSON.parse(localStorage.getItem("mode"));
  document.body.className = `${modeObject.modeState}`;
  modes.tag.innerHTML = modeObject.mode;
}

// Get and update document background
loadModeState();

page_container.parentNode.insertBefore(modes.tag, page_container);

function toDarkMode() {
  modes.tag.innerHTML = modes.dark;
}

function toLightMode() {
  modes.tag.innerHTML = modes.light;
}

function switchModes() {
  if (page_container.parentNode.classList.contains("light")) {
    page_container.parentNode.classList.replace("light", "dark");
    toDarkMode();
    // Update mode storage
    localStorage.setItem(
      "mode",
      JSON.stringify({ modeState: "dark", mode: modes.dark[0] })
    );
  } else {
    page_container.parentNode.classList.replace("dark", "light");
    toLightMode();
    //Update mode storage
    localStorage.setItem(
      "mode",
      JSON.stringify({ modeState: "light", mode: modes.light[0] })
    );
  }
}

mode_togglebox.addEventListener("click", switchModes);

// Intersection observer used to make a sticky or fixed header to ensure
// user navigates easily back to the top of the page

// Declare an element to observe
const header = document.querySelector(".top-header-wrapper");

//Set options for intersection
let options = {
  root: null,
  threshold: 0,
};

// Toggle header class
function toFixed(entries) {
  if (entries[0].isIntersecting) {
    header.classList.remove("fixed--js");
  } else {
    header.classList.add("fixed--js");
  }
}

// Initialise our Intersection observer contructor
let observer = new IntersectionObserver(toFixed, options);
// Run the observe function
observer.observe(document.querySelector(".page-preloader"));

// Scroll to top when page title is clicked
const headerTitle = document.querySelector(".title-block");
headerTitle.addEventListener("click", function () {
  const topHeader = document.querySelector("header");
  topHeader.scrollIntoView({ behavior: "smooth" });
});

//Attach event to card(li) parent element
ul_country_list.addEventListener("click", function (e) {
  if (loadingStates.contentIsLoaded) {
    let result;
    const list = [...ul_country_list.children];
    let targetIndex;
    for (let key in e) {
      if (key === "path") {
        e[key].forEach(
          (element) =>
            list.includes(element) && (targetIndex = list.indexOf(element))
        );
      }
    }
    if (targetIndex !== undefined) {
      const target = list[targetIndex];
      const target_textContent = target.textContent.replace(/\s/g, "");
      let strArr = target_textContent.replace(/[A-Z]/g, "\\$&").split("\\");
      // Remove empty string from array
      strArr = strArr.filter((str) => str);
      // Filter out the match from the array based on the given regex expression
      const match = strArr
        .filter((str) => str.match(/\b([a-z]+)?[:](\d+)?\b/i))
        .join("");

      // Preceed the match found in the given string with an underscore.
      // Finally, from the current position the match was found,
      // clear all strings from that position...
      const countryName = strArr
        .join("")
        .replace(match, "_$&")
        .replace(/[_](\S+)/g, "")
        .trim();

      //Preceed special characters in the string with a backslash
      const regex = countryName.replace(/[).\\$+\[-\]\(]/g, "\\$&");

      // Test the regular expression against the data['name'] string...
      for (let data of DATA) {
        if (RegExp("" + regex + "").test(data["name"].replace(/\s/g, ""))) {
          result = data;
          break;
        }
      }

      if (result) {
        runPreloader();
        loadPage(2);
        dataIsLoaded(result, dataInfo);
        history.push(result);
      }
    }
  }
});

// Filtering list based on filter options:
// africa, europe, asia, america, oceania
// and User Search query

function filtered(data) {
  for (let obj of data) {
    let temp = homeTemplate(obj);
    homeDataWrapper.innerHTML += temp;
  }
}

function filterList(e) {
  e.preventDefault();
  if (e.target.tagName === "A") {
    let targetContent = e.target.textContent;
    const filteredResult = DATA.filter((data) => {
      if (data["region"] === targetContent) {
        return data;
      }
    });
    if (filteredResult.length) {
      drop_down_title.textContent = targetContent;
      observerState.observe = false;
      dataPreloader();
      dataIsLoaded(filteredResult, filtered);
    } else alert(`No result for ${targetContent}`);
  }
}

ul_dropdown.addEventListener("click", filterList);

// The Search
// ______________
function searchCountry() {
  const input = search_field.value;
  let result;
  const regex = /^[a-z]+$/i;
  const trimedInput = input.trim();
  if (regex.test(trimedInput)) {
    const validInput = trimedInput;
    const regexSearch = new RegExp("\\b" + validInput + "\\b", "i");
    for (let data of DATA) {
      // Checking the name property first
      if (regexSearch.test(data["name"])) {
        result = data;
      }

      if (data["altSpellings"]) {
        //If result is still not found, we check the object altSpelling property
        data["altSpellings"].forEach((id) => {
          if (regexSearch.test(id)) result = data;
        });
      }

      // Then we break out of the for loop if result is found
      if (result) break;
    }

    if (result) {
      //We remove input--error-js class from our element if there was
      searchSuccess();

      // Finally, output the result to the page
      dataPreloader();
      dataIsLoaded([result], filtered);
    } else {
      searchFailure();
    }
  } else {
    searchFailure();
  }
}

function searchSuccess() {
  if (searchbox_shell.classList.contains("input--error-js")) {
    searchbox_shell.classList.remove("input--error-js");
    searchbox_shell.classList.add("shrink--js");
    searchbox_shell.classList.remove("expand--js");
  }
}

function searchFailure() {
  searchbox_shell.classList.add("input--error-js");
  searchbox_shell.classList.remove("shrink--js");
  searchbox_shell.classList.add("expand--js");
}

search_icon_box.addEventListener("click", searchCountry);

// Go back to previous page
//_________________________
function backTo(htry) {
  const prev = htry.length - 1;
  prev < 1 ? (loadDocument(), resetDropDownTitle()) : dataInfo(htry[prev - 1]);
  htry.pop();
}

back_navigator.addEventListener("click", function (e) {
  e.preventDefault();
  backTo(history);
});

const resetDropDownTitle = () =>
  (drop_down_title.textContent = "Filter by Region");

// The border country info
//________________________
// Finding infomation about any clicked border country
function myBorderCountry(e) {
  e.preventDefault();
  if (e.target.tagName === "A") {
    let result;
    const a_content = e.target.textContent.trim();
    for (let data of DATA) {
      if (data["name"] === a_content) {
        result = data;
        break;
      }
    }
    if (result) {
      dataPreloader();
      dataIsLoaded(result, dataInfo);
      history.push(result);
    }
  }
}

a_tagContainer.addEventListener("click", myBorderCountry);
