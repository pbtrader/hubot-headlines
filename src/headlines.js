// Description: 
//	Hubot script to retrieve most recent article headlines and links from the New York Times
//
// Configuration:
//	HUBOT_NYTIMES_API_KEY - specify the API key for use with NyTimes
//
// Commands:
//	headlines all - returns 5 articles from all categories of the NyTimes
//	headlines [section] - returns 5 articles from a specified section of the NyTimes
//	headlines help - view help instructions


const API_KEY = process.env.HUBOT_NYTIMES_API_KEY||'apiKey';
const BASE_URL = "http://api.nytimes.com/svc/news/v3/content/all/";

module.exports = function(robot) {

	robot.respond(/headlines (.*)/i, function(msg){
		let section = msg.match[1];
		if (section === "help") {
			return helpInstructions(msg);
		}

		if (API_KEY === 'apiKey') {
			return msg.send("Invalid API Key");
		}
		const URL = makeURL(section);

		nyTimesAPICall(URL, msg);
	});
}

function makeURL(section) {
	const hours = 24;		// number of hours to look back
	const limit = 5;		// number of articles to return
	return BASE_URL + section + "/" + hours + ".json?limit=" + limit + "&api-key=" + API_KEY;
}

function nyTimesAPICall(URL, msg) {
	msg.http(URL).get()(function(error, response, body) {	
		const data = JSON.parse(body);
		const articles = data.results;
		const status = data.status;

		// API does not send any data to the error parameter, so we check for a status of ERROR
		if (status === "ERROR") {
			return msg.send ("Error. Try 'hubot headlines help' for help.");
		}

		let newsData = "";
		const footer = "Articles provided by the New York Times";
		const footerIconAddress = "http://static01.nytimes.com/packages/images/developer/logos/poweredby_nytimes_30a.png";
		for (let i = 0; i < articles.length; i ++) {
			let story = articles[i];
			let title = story.title;
			let link = story.url;
			let abstract = story.abstract;
			let fallback = title;

			if (i < articles.length - 1) {
				newsData += JSON.stringify({fallback: fallback, title: title, title_link: link, text: abstract},null,4);
				newsData +=",";
			}
			// add a footer to the last article
			else {
				newsData += JSON.stringify({fallback: fallback, title: title, title_link: link, text: abstract, footer: footer, footer_icon: footerIconAddress},null,4);
			}
		}

		//return msg.send(newsData);
		return  msg.send({ 'attachments' : [newsData] });
	});
}

function helpInstructions(msg) {
	let helpString = `The headlines hubot retrieves the 5 most recent headlines from the New York Times. 
	For all sections, type 'hubot headlines all'. 
	To get headlines for a particular section, enter 'hubot headlines section'. 
	Allowed sections are u.s., world, business, arts, sports, politics, tech, opinion, 
	science, food, travel, theatre, magazine, and real estate.`;

	return msg.send(helpString);
}

