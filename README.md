Suggestion Box
==============
This is a simple application written using [Meteor](http://meteor.com/) that allows employees to submit suggestions to their employer with 100% anonyminity. It also allows other employees to like their co-workers suggestions so an employer can gauge the worth of each suggestion.

Installation
------------
1. Download and install Meteor from [here](http://docs.meteor.com/#quickstart).
2. Clone this repository `git clone https://awmichel@github.com/awmichel/Suggestion-Box.git`
3. `cd Suggestion-Box`
4. Test locally using `meteor` or deploy to the meteor cloud `meteor deploy site.meteor.com`

Notes
-----
* There is no authentication of any kind at the moment and no tracking via cookies so a single person could potentially like someting multiple times. I'm open to suggestions on this.
* Meteor is still very young and allows anyone to manipulate the database via the Console. They're saying authentication is coming soon and will help prevent misuse.
* I wouldn't consider this a secure, production-ready app. It works but there isn't much in place to prevent vandalism. Use at your own risk.