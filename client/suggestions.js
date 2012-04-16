Suggestions = new Meteor.Collection("suggestions");

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

Template.suggestion_list.suggestions = function() {
  return Suggestions.find({success: false}, {sort: {likes: -1}});
};

Template.suggestion_list.has_suggestions = function() {
  return (Suggestions.count == 0) ? false : true;
}

Template.suggestion_info.like_level = determine_like_level;

Template.suggestion_list.events = {};
Template.suggestion_list.events[ okcancel_events('#new-suggestion') ] =
  make_okcancel_handler({
    ok: function(text, evt) {
      Suggestions.insert({content: text, likes: 1, success: false});
      evt.target.value = '';
    },
    cancel: function(evt) {
      evt.target.value = '';
    }
  });

Template.suggestion_info.events = {
  'click a.like': function() {
    Suggestions.update(this._id, {$inc: {likes: 1}});
  },
  'click a.complete': function() {
    Suggestions.update(this._id, {$set: {success: true}});
  },
  'click a.edit': function() {
    
  },
  'click a.delete': function() {
    var sure = confirm('Are you sure you want to delete this suggestion?');
    if (sure) {
      Suggestions.remove(this._id);
    }
  }
};

Template.successful_suggestions.suggestions = function() {
  return Suggestions.find({success: true}, {sort: {likes: -1}});
}

Template.successful_suggestions.like_level = determine_like_level;
