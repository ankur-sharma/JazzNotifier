function fetch_feed() {
	//alert("start");
	chrome.extension.sendRequest({'action' : 'fetch_feed', 'url' : localStorage["feedurl"]}, 
		function(response) {
			display_stories(response);
		}
	);
}

function display_stories(feed_data) {
	if (feed_data == null) {
		alert("Feed data is null. Make sure there is an active session to CLM server.");
		return;
	}
	//console.log(feed_data);
	if (verifyLogin(feed_data)) {
		alert("Could not find any active session to CLM server. Log in to CLM server first.");
		return;
	}
	//alert(feed_data);
	var xml_doc = $.parseXML(feed_data);
	$xml = $(xml_doc);
	var items = $xml.find("entry");
	//$('#popup').html('<img src="images/logo.png" id="logo" onclick="open_item(\'http://lifehacker.com/\'); window.close();" /><br clear="all" />');	
	if (items.length == 0) {
		$('#popup').html('No entries returned by the feed');
	}
	items.each(function(index, element) {
		//alert(JSON.strinigy(element);
		var entry = parse_entry(element);
		var item = '';
		item += '<div class="entry">'
		item += '<span class="title">' + entry.title + '</span>\
				<span class="updated"><p>' + entry.updated + '</span><p>\
				<span class="summary">' + entry.summary + '</span><br><hr>'
			
		/* item += '<span class="tag">' + post.title + '</span>\
					<a href="' + post.url + '">\
						<div id="' + post.id + '" class="item" onclick="open_item(\'' + post.url + '\');">\
							<h4>' + post.title + '</h4>\
							<span class="description">' + post.description + '...</span>\
						</div>\
					</a>'; */
		item += '</div>';
		$('#popup').append(item);
	});
}

function verifyLogin(data) {
	if (data.substr(0,15) == '<!DOCTYPE html>')
		return true;
}

function init(){
	$(document).ready(function() {
	fetch_feed();
	});
}

init();