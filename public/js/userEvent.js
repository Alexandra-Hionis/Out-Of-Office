
  $(document).ready(function() {
    // Getting jQuery references to the event name, location, details, who's coming and form.
    var eventNameInput = $("#event-name");
    var locationInput = $("#location");
    var detailsInput = $("#details");
    var participantsInput = $("#participants");
    var createEventForm = $("#createEvent");
    var categorySelect = $("#inputCategory");

    $(document).on("click", "button.delete", handleEventDelete);
    
    // Adding an event listener for when the form is submitted
    $(createEventForm).on("submit", handleFormSubmit);
    // Gets the part of the url that comes after the "?" (which we have if we're updating an event)
    var url = window.location.search;
    var eventId;
    var category_id;
    // Sets a flag for whether or not we're updating an event to be false initially
    var updating = false;
  
    // If we have this section in our url, we pull out the event id from the url
    // In '?post_id=1', eventId is 1
    if (url.indexOf("?event_id=") !== -1) {
      eventId = url.split("=")[1];
      getEventData(eventId, "event");
    }
    // Otherwise if we have an category id in our url, preset the category select box to be our category
    else if (url.indexOf("?category_id=") !== -1) {
      category_id = url.split("=")[1];
    }

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
        categoryId: categorySelect.val()
        // maybe make lowercase
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
    function submitEvent(event) {
      $.post("/api/events", event, function() {
        window.location.href = "/events";
      });
    }
  
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
          console.log(data.category_id || data.id);
          // If this category exists, prefill our cms forms with its data
          eventNameInput.val(data.eventName);
          locationInput.val(data.body);
          detailsInput.val(data.body);
          participantsInput.val(data.body);
          category_id = data.category_id || data.id;
          // If we have a post with this id, set a flag for us to know to update the post
          // when we hit submit
          updating = true;
        }
      });
    }
  
    // May not need

    // A function to get categories and then render our list of Authors
    function getCategories() {
      $.get("/api/categories", renderCategoryList);
    }
    // Function to either render a list of authors, or if there are none, direct the user to the page
    // to create an author first
    function renderCategoryList(data) {
      if (!data.length) {
        window.location.href = "/categories";
      }
      $(".hidden").removeClass("hidden");
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createCategoryRow(data[i]));
      }
      categorySelect.empty();
      console.log(rowsToAdd);
      console.log(categorySelect);
      categorySelect.append(rowsToAdd);
      categorySelect.val(category_id);
    }
  
    // Creates the category options in the dropdown
    function createCategoryRow(category) {
      var listOption = $("<option>");
      listOption.attr("value", category.id);
      listOption.text(category.name);
      return listOption;
    }
  
    // Update a given post, bring user to the blog page when done
    function updateEvent(post) {
      $.ajax({
        method: "PUT",
        url: "/api/events",
        data: post
      })
        .then(function() {
          window.location.href = "/events";
        });
    }

     // This function does an API call to delete events
  function deleteEvent(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/events/" + id
    })
      .then(function() {
        window.location.href = "/events";
      });
  }

  // This function figures out which event we want to delete and then calls
  // deletePost
  function handleEventDelete() {
    var currentEvent = $(this)
      .parent()
      .parent()
      .data("event");
    deleteEvent(currentEvent.id);
  }
  
  });


  