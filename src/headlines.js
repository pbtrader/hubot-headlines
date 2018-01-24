// Description: Retrieves most recent headlines from the NYTimes

// Ideas - split out URL into various components - let the user pick section, number
// store API key separately

// msg.http("http://api.nytimes.com/svc/news/v3/content/all/world/12.json?limit=5&api-key=67a624d7295f49feb2cc0d48b764ce46")

const API_KEY = process.env.HUBOT_NYTAPI

module.exports = function(robot) {

	robot.respond(/headlines/i, function(msg){

		var section = msg.match[1];
		if (section == "help") {
			return helpInstructions(msg);
		}

		// return articles from all sections if no section is specified
		if (section == null) {
			section = "all";
		}

		var API_KEY = "67a624d7295f49feb2cc0d48b764ce46";
		var baseURL="http://api.nytimes.com/svc/news/v3/content/all/";
		var hours = 24;
		var limit = 5;

		var URL = makeURL(baseURL,section,hours,limit,API_KEY);

		nyTimesAPICall(URL,msg);
		
	})
};


function makeURL(base,section,hours,limit,API_KEY) {
	var URL = base + section + "/" + hours + ".json?limit=" + limit + "&api-key=" + API_KEY;
	return URL;
}

function nyTimesAPICall(URL,msg) {
			msg.http(URL).get()(function(error,response,body) {
			
			data = JSON.parse(body);
			articleData = data.results;
			status = data.status;
			if (status == "ERROR") {
				return msg.send ("Error. Try hubot headlines help for help");
			}

			var articles = [];

			for (var i = 0; i < articleData.length; i ++) {
				story = articleData[i];
				articles.push(story);
			}

			var newsData = "";
			for (var i = 0; i < articles.length; i ++) {
				var story = articles[i];
				newsData += (story.title) + "\t\t" + JSON.stringify(story.url) + "\n";
			}

			return msg.send(newsData);
		});

}

function helpInstructions(msg) {
	var helpString = "";
		helpString += "The headlines hubot retrieves the 5 most recent headlines from the New York Times. \n";

		helpString += "\t For all categories, type 'hubot headlines'. \n";
		helpString += "\t To get headlines for a particular section, enter 'hubot headlines section'. \n";
		helpString += "\t Allowed sections are u.s., world, business, arts, sports, politics, tech, opinion, \n";
		helpString += "\t science, food, travel, and real estate.";

		return msg.send(helpString);

};

