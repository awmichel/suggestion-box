// Define collections to match publish.js
Suggestions = new Meteor.Collection("suggestions");
Comments = new Meteor.Collection("comments");

// ID of focused suggestion.
Session.set('suggestion_id', null);

// Array of previously liked suggestions.
Session.set('liked_suggestion_ids', []);

// Boolean of admin status (waiting on Auth module)
Session.set('admin', false);

// Subscribe to 'suggestions' on startup.
Meteor.subscribe('suggestions');

// Autosubscribe to the selected suggestion's comment stream.
Meteor.autosubscribe(function() {
  var suggestion_id = Session.get('suggestion_id');
  if (suggestion_id) {
    Meteor.subscribe('comments', suggestion_id);
  }
});


////////// Define Helper Functions //////////

// Returns an event_map key for attaching "ok/cancel" events to
// a text input (given by selector)
var okcancel_events = function (selector) {
  return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
};

// Creates an event handler for interpreting "escape", "return", and "blur"
// on a text field and calling "ok" or "cancel" callbacks.
var make_okcancel_handler = function (options) {
  var ok = options.ok || function () {};
  var cancel = options.cancel || function () {};

  return function (evt) {
    if (evt.type === "keydown" && evt.which === 27) {
      // escape = cancel
      cancel.call(this, evt);

    } else if (evt.type === "keyup" && evt.which === 13 ||
               evt.type === "focusout") {
      // blur/return/enter = ok/submit if non-empty
      var value = String(evt.target.value || "");
      if (value)
        ok.call(this, value, evt);
      else
        cancel.call(this, evt);
    }
  };
};

// Determine "like level" of a particular suggestion.
var determine_like_level = function() {
  if (this.likes >= 20) {
    return 3;
  } else if (this.likes >= 10) {
    return 2;
  } else if (this.likes >= 5) {
    return 1;
  } else {
    return 0;
  }
}

var is_user_admin = function() {
  if (Session.get('admin'))
    return true;
  return false;
}

///////// Suggestion List //////////
Template.suggestion_list.suggestions = function() {
  return Suggestions.find({complete: false}, {sort: {likes: -1}});
};

Template.suggestion_list.has_suggestions = function() {
  return (Suggestions.find({complete: false}).count() == 0) ? false : true;
}

Template.suggestion_list.events = {};
Template.suggestion_list.events[ okcancel_events('#new-suggestion') ] =
  make_okcancel_handler({
    ok: function(text, evt) {
      Suggestions.insert({
        content: text, 
        likes: 1, 
        complete: false, 
        timestamp: (new Date()).getTime()
      });
      evt.target.value = '';
    },
    cancel: function(evt) {
      evt.target.value = '';
    }
  });

///////// Suggestion Info /////////
Template.suggestion_info.like_level = determine_like_level;
Template.suggestion_info.is_admin = is_user_admin;

Template.suggestion_info.timeago = function() {
  return new moment(this.timestamp).fromNow();
}

Template.suggestion_info.events = {
  'click a.like': function() {
    var user_likes = Session.get('liked_suggestion_ids');
    if (user_likes.indexOf(this._id) < 0) {
      Suggestions.update(this._id, {$inc: {likes: 1}});
      user_likes.push(this._id)
      Session.set('liked_suggestion_ids', user_likes);
    } else {
      alert("You have already liked this suggestion.");
    }
  },
  'click a.complete': function() {
    Suggestions.update(this._id, {$set: {complete: true}});
  },
  'click a.delete': function() {
    var sure = confirm('Are you sure you want to delete this suggestion?');
    if (sure) {
      Suggestions.remove(this._id);
    }
  }
};

///////// Completed Suggestions /////////
Template.completed_suggestions.suggestions = function() {
  return Suggestions.find({complete: true}, {sort: {timestamp: -1}});
}

Template.completed_suggestions.has_suggestions = function() {
  return (Suggestions.find({complete: true}).count() == 0) ? false : true;
}

Template.completed_suggestions.like_level = 0;
