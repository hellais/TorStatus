// ~ router.js ~
define([
  'jquery',
  'underscore',
  'backbone',
  'views/details/main',
  'views/search/main',
  'views/search/do',
  'views/about/main',
], function($, _, Backbone, mainDetailsView, mainSearchView, doSearchView, aboutView){
  var AppRouter = Backbone.Router.extend({
    routes: {
    	// Define the routes for the actions in Tor Status
    	'details/:fingerprint': 'mainDetails',
    	'search/:query': 'doSearch',
    	'about': 'showAbout',

    	// Default
    	'*actions': 'defaultAction'
    },
    // Show the details page of a node
    mainDetails: function(fingerprint){

        $("#home").removeClass("active");
        $("#about").removeClass("active");

        $("#loading").show();
        $("#content").hide();

        mainDetailsView.model.fingerprint = fingerprint;
        mainDetailsView.model.lookup({
            success: function(relay) {
                $("#content").show();
    	        mainDetailsView.render();
                $("#loading").hide();

            }
        });
    },

    // Perform a search on Tor Status
    doSearch: function(query){
        $("#home").removeClass("active");
        $("#about").removeClass("active");

        $("#loading").show();
        $("#content").hide();

        $("#nav-search").val(query);
        if (query == "") {
            doSearchView.error(0);
        } else {
            doSearchView.collection.url = doSearchView.collection.baseurl + query;
            doSearchView.collection.lookup({
                success: function(relays){
                    $("#content").show();
                    doSearchView.relays = doSearchView.collection.models;
                    doSearchView.render(query);
                    $("#loading").hide();
                },

                error: function(erno){
                    $("#content").show();
                    doSearchView.error(erno);
                    $("#loading").hide();
                }
            });
        }
    },
    // Display the Tor Status about page
    showAbout: function(){
        $("#home").removeClass("active");
        $("#about").addClass("active");

        $("#loading").show();
        //$("#content").hide();

    	aboutView.render();

        $("#loading").hide();
        //$("#content").show();
    },

    // No matched rules go to the default home page
    defaultAction: function(actions){
        $("#home").addClass("active");
        $("#about").removeClass("active");

        $("#loading").show();
        //$("#content").hide();

        mainSearchView.render();

        //$("#content").show();
        $("#loading").hide();
    }

  });

  var initialize = function(){
    var app_router = new AppRouter;
    Backbone.history.start();

    // This is probably a dirty trick and there should be a better
    // way of doing so.

    $("#nav-search").submit(function(e){
        var query = _.escape($(this).children("input.search-query").val());
        console.log(query);
        $("#suggestion").hide();
        document.location = "#search/"+query;
        return false;
    });
  };
  return {
    initialize: initialize
  };
});
