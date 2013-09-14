function parse_entry(element) {
	// console.log(element);
	var entry = new Object();
	entry.title = $(element).find("title").text();
	entry.id = $(element).find("id").text();
	entry.updated = new Date($(element).find("updated").text());	
	entry.url = $(element).find('link').text();
	entry.summary = $(element).find('summary').text();
	entry.category = $(element).find('category').attr('term');
	entry.link = $(element).find('link').attr('href');
	entry.typeName = $(element).find('typeName').text();
	//alert(JSON.stringify(entry));
	// console.log(entry);
	return entry;
}

function open_item(url) {
	chrome.tabs.create({url: url});
	chrome.browserAction.setBadgeText({text:''});
}

function GetNotificationType(entry) {
	if (entry.category == 'com.ibm.team.feeds.workItemChange') {
		return 'list';
	} else {
		return 'basic';
	}
}

function HtmlToTxt(entry) {
	if (entry.category == 'com.ibm.team.feeds.workItemChange') {
		return HtmlToTxtWIChange(entry.summary);
	} else {
		return HtmlToTxtGeneric(entry.summary);
	}
}
function HtmlToTxtGeneric(str) {
	var nodes = $(str);
	var text = "";
	nodes.each(function(index, node) {
		if (node.nodeName == 'BR') {
			text += "\r\n";
			text += $(node).text();
		} else if (node.nodeName == 'TABLE') {
			var cells = $(node).find('TD');
			cells.each(function(i, cell) {
				if (i % 2 == 0) {
					text += "\r\n";
				} else  {
					text += "\t";
				}
				text += $(cell).text();
			});
		} else {
			text += $(node).text();
		}
	});
	return text;
}

function HtmlToTxtWIChange(str) {
	var nodes = $(str);
	var text = "";
	nodes.each(function(index, node) {
		if (node.nodeName == 'BR') {
			text += "\r\n";
			text += $(node).text();
		} else if (node.nodeName == 'TABLE') {
			// skip them
		} else {
			text += $(node).text();
		}
	});
	return text;
}

function GetMessageList(str){
	var nodes = $(str);
	var text = "";
	var itemindex = 0;
	var items = [];
	var item = {};
	nodes.each(function(nodeindex, node) {
		var cells = $(node).find('TD');
		cells.each(function(cellindex, cell) {
			if (cellindex % 2 == 1) {
				item.message = $(cell).text();
				items[itemindex++] = item;
			} else  {
				item = {};
				item.title = $(cell).text();
			}
		});		
	});
	return items;
}