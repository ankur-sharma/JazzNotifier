function fetch_feed(url, callback) {
	//alert(callback);
	var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(data) {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var data = xhr.responseText;
		  //alert(data);
		  if (callback == null ){		  
			return data;
		  } else {
			callback(data);
			}
        } else {
          callback(null);
        }
      }
    }
    // Note that any URL fetched here must be matched by a permission in
    // the manifest.json file!
    xhr.open('GET', url, true);
    xhr.send();
}	


function onRequest(request, sender, callback) {
	if (request.action == 'fetch_feed') {
      fetch_feed(request.url, callback);
    }
}

function parseForNotifications(feedData) {
	//alert(feedData);
	var lastFeedDate = new Date(localStorage["lastFeedDate"]);
	if (lastFeedDate == null) lastFeedDate = new Date();
	//alert(lastFeedDate);
	var xml_doc = $.parseXML(feedData);
	$xml = $(xml_doc);
	var items = $xml.find("entry");	
	//createNotification(items);
	items.each(function(index, element) {
		var entry = parse_entry(element);
		if (entry.updated > lastFeedDate) {
			if (entry.updated > new Date(localStorage["lastFeedDate"])) {
				localStorage["lastFeedDate"] = entry.updated;
			}
			createNotification(entry);
		}
	});
}

function createNotification(entry){
	var options = {};
	options.type = GetNotificationType(entry);
	options.title = entry.title;
	options.message = HtmlToTxt(entry);
	options.items = GetMessageList(entry.summary);
	options.iconUrl = chrome.runtime.getURL("/images/workitem_editor_obj32.png");
	options.buttons = [];
	var winum = entry.link.split('/');
	options.buttons.push({ title: entry.typeName + " " + winum[winum.length-1] });
	//console.log(options.message);
	chrome.notifications.create(entry.link, options, creationCallback);
}

function creationCallback(notID) {
	//console.log("Succesfully created " + notID + " notification");
}

function checkForNotifications() {	
	var timeOut = localStorage["refreshTime"] * 1000 * 60;
	var feedData = fetch_feed(localStorage["feedurl"], parseForNotifications);
	var t = setTimeout(checkForNotifications, timeOut);
}

window.addEventListener("load", function() {
	// set up the event listeners
	//chrome.notifications.onClosed.addListener(notificationClosed);
	//chrome.notifications.onClicked.addListener(notificationClicked);
	chrome.notifications.onButtonClicked.addListener(notificationBtnClick);
});

function notificationBtnClick(notID, iBtn) {
	window.open(notID);
}

//var feedData = getFeedData();
// Wire up the listener.
chrome.extension.onRequest.addListener(onRequest);
checkForNotifications();

