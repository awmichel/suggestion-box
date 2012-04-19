// Suggestions -- {content: String, 
//                 success: Boolean}
Suggestions = new Meteor.Collection("suggestions");

// Publish list of all suggestions to clients.
Meteor.publish('suggestions', function() {
  return Suggestions.find();
});

// Comments -- {content: String,
//              suggestion_id: String,
//              timestamp: Number}
Comments = new Meteor.Collection("comments");

// Publish comments for the requested suggestion.
Meteor.publish('comments', function(suggestion_id) {
  return Comments.find({suggestion_id: suggestion_id});
});