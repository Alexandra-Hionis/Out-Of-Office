module.exports = function(sequelize, DataTypes) {
    var UserEvent = sequelize.define("UserEvent");
    return UserEvent;
  };
  
  $(document).ready(function() {
    // Getting jQuery references to the event name, location, details, who's coming and form.
    var eventNameInput = $("#event-name");
    var locationInput = $("#location");
    var detailsInput = $("details");
    var participantsInput = $("#participants");
    var createEventForm = $("#createEvent");
    var categorySelect = $("#inputCategory");
    
    // Adding an event listener for when the form is submitted
    $(createEventForm).on("submit", handleFormSubmit);
    // Gets the part of the url that comes after the "?" (which we have if we're updating an event)
    var url = window.location.search;
    var eventId;
    var categoryId;
    // Sets a flag for whether or not we're updating an event to be false initially
    var updating = false;
  
    // If we have this section in our url, we pull out the event id from the url
    // In '?post_id=1', eventId is 1
    if (url.indexOf("?event_id=") !== -1) {
      eventId = url.split("=")[1];
      getEventData(eventId, "event");
    }
    Otherwise if we have an category id in our url, preset the category select box to be our category
    else if (url.indexOf("?category_id=") !== -1) {
      categoryId = url.split("=")[1];
    }

    // ****** not sure what to do with above or below ********
  
    // Getting the categories, and their event
    getCategories();
  
    // A function for handling what happens when the form to create a new event is submitted
    function handleFormSubmit(event) {
      event.preventDefault();
      // Wont submit the event if we are missing a name, location, details
      if (!eventNameInput.val().trim() || !locationInput.val().trim() || !detailsInput.val().trim() || !participantsInput.val().trim() || !categorySelect.val()) {
        return;
      }
      // Constructing a newEvent object to hand to the database
      var newEvent = {
        eventName: eventNameInput
          .val()
          .trim(),
        location: locationInput
          .val()
          .trim(),
        details: detailsInput
          .val()
          .trim(),
        participants: participantsInput
          .val()
          .trim(),
        CategoryId: categorySelect.val()
      };
  
      // If we're updating an event run updateEvent to update a event
      // Otherwise run submitEvent to create a whole new event
      if (updating) {
        newEvent.id = eventId;
        updateEvent(newEvent);
      }
      else {
        submitEvent(newEvent);
      }
    }
  
    // Submits a new event and brings user to main event page upon completion
    function submitEvent(post) {
      $.post("/api/events", post, function() {
        window.location.href = "/blog";
      });
    }

    // ********* not sure if this is right. It was "/api/posts" before**************************************************************
  
    // Gets event data for the current event if we're editing, or if we're adding to an author's existing events
    function getEventData(id, type) {
      var queryUrl;
      switch (type) {
      case "event":
        queryUrl = "/api/events/" + id;
        break;
        default:
        return;
      }
      // May not need categories
      
      $.get(queryUrl, function(data) {
        if (data) {
          console.log(data.CategoryId || data.id);
          // If this category exists, prefill our cms forms with its data
          eventNameInput.val(data.eventName);
          locationInput.val(data.body);
          detailsInput.val(data.body);
          participantsInput.val(data.body);
          authorId = data.AuthorId || data.id;
          // If we have a post with this id, set a flag for us to know to update the post
          // when we hit submit
          updating = true;
        }
      });
    }
  
    // // A function to get Authors and then render our list of Authors
    // function getCategories() {
    //   $.get("/api/categories", renderCategoryList);
    // }
    // // Function to either render a list of authors, or if there are none, direct the user to the page
    // // to create an author first
    // function renderCategoryList(data) {
    //   if (!data.length) {
    //     window.location.href = "/authors";
    //   }
    //   $(".hidden").removeClass("hidden");
    //   var rowsToAdd = [];
    //   for (var i = 0; i < data.length; i++) {
    //     rowsToAdd.push(createAuthorRow(data[i]));
    //   }
    //   authorSelect.empty();
    //   console.log(rowsToAdd);
    //   console.log(authorSelect);
    //   authorSelect.append(rowsToAdd);
    //   authorSelect.val(authorId);
    // }
  
    // // Creates the author options in the dropdown
    // function createAuthorRow(author) {
    //   var listOption = $("<option>");
    //   listOption.attr("value", author.id);
    //   listOption.text(author.name);
    //   return listOption;
    // }
  
    // // Update a given post, bring user to the blog page when done
    // function updatePost(post) {
    //   $.ajax({
    //     method: "PUT",
    //     url: "/api/posts",
    //     data: post
    //   })
    //     .then(function() {
    //       window.location.href = "/blog";
    //     });
    // }
  });
  