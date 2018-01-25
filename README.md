# hubot-headlines

hubot script to pull NYTimes headlines

See [`src/headlines.js`](src/headlines.js) for full documentation.

## Installation

In hubot project repo, run:

`npm install hubot-headlines --save`

Then add **hubot-headlines** to your `external-scripts.json`:

```json
[
  "hubot-headlines"
]
```

##Configuration
'''
HUBOT_NYTIMES_API_KEY - key for the New York Times API 
'''

## Sample Interaction

```
user1>> hubot headlines all
hubot>> Explosive Weapons
	https://www.nytimes.com/2018/01/24/opinion/explosive-weapons.html
What Homoerotic Videos Can Teach Us About Modern Russia
	https://www.nytimes.com/2018/01/24/opinion/homoerotic-videos-russia.html
Mark E. Smith of the Fall: Listen to 12 Essential Tracks
	https://www.nytimes.com/2018/01/24/arts/music/mark-e-smith-the-fall-best-songs.html
Sinking Islands, Floating Nation
	https://www.nytimes.com/2018/01/24/opinion/kiribati-climate-change.html
Sinking Islands, Floating Nation
	https://www.nytimes.com/video/opinion/100000005676901/sinking-islands-floating-nation.html

```

## NPM Module

https://www.npmjs.com/package/hubot-headlines
