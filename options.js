// Save this script as `options.js`

// Saves options to localStorage.
function save_options() {
  var select = document.getElementById("feedURL");
  var feedurl = select.value;
  select = document.getElementById("refreshTime");
  var refreshTime = select.value;
  localStorage["feedurl"] = feedurl;
  localStorage["refreshTime"] = refreshTime;
  if (localStorage["lastFeedDate"] == undefined) {
	localStorage["lastFeedDate"] = new Date();
  }
  

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var feedurl = localStorage["feedurl"];
  var refreshTime = localStorage["refreshTime"];
  var select = document.getElementById("feedURL");
  select.value = feedurl;
  select = document.getElementById("refreshTime");
  select.value = refreshTime;
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);