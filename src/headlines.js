// Description: 
//	Hubot script to retrieve most recent article headlines and links from the New York Times
//
// Configuration:
//	HUBOT_NYTIMES_API_KEY - specify the API key for use with NyTimes
//
// Commands:
//	headlines - returns 5 articles from all categories of the NyTimes
//	headlines [section] - returns 5 articles from a specified section of the NyTimes
//	headlines help - view help instructions


const API_KEY = process.env.HUBOT_NYTIMES_API_KEY||'apiKey';
const BASE_URL = "http://api.nytimes.com/svc/news/v3/content/all/";

module.exports = function(robot) {

	robot.respond(/headlines (.*)/i, function(msg){
		let section = msg.match[1];
		if (section == "help") {
			return helpInstructions(msg);
		}

		const hours = 24;		// number of hours to look back
		const limit = 5;		// number of articles to return

		if (API_KEY == 'apiKey') {
			return msg.send("Invalid API Key");
		}
		const URL = makeURL(BASE_URL,section,hours,limit,API_KEY);

		nyTimesAPICall(URL,msg);
	});
}


function makeURL(base,section,hours,limit,API_KEY) {
	const URL = base + section + "/" + hours + ".json?limit=" + limit + "&api-key=" + API_KEY;
	return URL;
}

function nyTimesAPICall(URL,msg) {
	msg.http(URL).get()(function(error,response,body) {	
		data = JSON.parse(body);
		articleData = data.results;
		status = data.status;
		if (status == "ERROR") {
			return msg.send ("Error. Try 'hubot headlines help' for help.");
		}
	
		let articles = [];


		// build an array of the articles
		for (let i = 0; i < articleData.length; i ++) {
			let story = articleData[i];
			articles.push(story);
		}

		let newsData = "";
		// using a separate loop to create the return string
		// this allows for the ability to easily change which JSON data is 
		// displayed in the future
		for (let i = 0; i < articles.length; i ++) {
			let story = articles[i];
			newsData += (story.title) + "\n\t" + (story.url) + "\n";
		}
		return msg.send(newsData);
	});
}

function helpInstructions(msg) {
	var helpString = "";
	helpString += "The headlines hubot retrieves the 5 most recent headlines from the New York Times. \n";
	helpString += "\t For all sections, type 'hubot headlines all'. \n";
	helpString += "\t To get headlines for a particular section, enter 'hubot headlines section'. \n";
	helpString += "\t Allowed sections are u.s., world, business, arts, sports, politics, tech, opinion, \n";
	helpString += "\t science, food, travel, theatre, magazine, and real estate.";

	return msg.send(helpString);
}

