// ~ collections/results ~
define([
  'jquery',
  'underscore',
  'backbone',
  'models/relay'
], function($, _, Backbone, relayModel){
	var resultsCollection = Backbone.Collection.extend({
		model: relayModel,
		baseurl: 'http://onionoo.torproject.org/summary/search/',
		url: '',
		lookup: function(options) {
            var success = options.success;
            var error = options.error;
            var collection = this;
            options.success = $.getJSON(this.url, function(response) {
                this.fresh_until = response.fresh_until;
                this.valid_after = response.valid_after;
                var relays = [];
                options.error = function(options) {
                    console.log('error..');
                    error(options.error, collection, options);
                }
                _.each(response.relays, function(relay, resultsC) {
                    crelay = new relayModel;
                    crelay.fingerprint = relay.f;
                    relays.push(crelay);
                });
                if (relays.length == 0) {
                    error(0);
                    console.log('error');
                    return false;
                } else if (relays.length > 40) {
                    error(1);
                    return false;
                }
                _.each(relays, function(relay) {
                    relay.lookup({
                        success: function(){
                            if (relays.length == response.relays.length) {
                                collection[options.add ? 'add' : 'reset'](relays, options);
                                success(collection, relays);
                                return relays;
                            }
                        },
                        error: function() {
                            console.log("error in loading..");
                            error(0);
                        }
                    });
                });
            }).error(
                function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                if(jqXHR.statusText == "error") {
                    error(2);
                } else {
                    error(3);
                }
                /*
                console.log("jqXHR: " +
                    jqXHR + " textStauts: " +
                    textStatus + " errorThrown: " +
                    errorThrown);
                console.log("error in doing query..");
                error(2)
                */
                }
            );
        }

	});
	return resultsCollection;
});

