// This is the boilerplate file
// it should be used as a base for every module
define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
    var graphModel = Backbone.Model.extend({
        baseurl: 'http://85.214.195.203',
        initialize: function() {
        this.set({
            days: {write: [], read: []},
            week: {write: [], read: []},
            month: {write: [], read: []},
            months: {write: [], read: []},
            year: {write: [], read: []},
            years: {write: [], read: []}
            });
        },
        lookup: function(fingerprint, options) {
            var model = this;
            var success = options.success;
            // Clear the model
            this.set({
                days: {write: [], read: []},
                week: {write: [], read: []},
                month: {write: [], read: []},
                months: {write: [], read: []},
                year: {write: [], read: []},
                years: {write: [], read: []}
            });

            $.getJSON(this.baseurl+'/bandwidth/lookup/'+fingerprint, function(data) {
                model.data = data;
                success(model, data);
            });
        },

        parsebwdata: function(data) {
            var model = this;
            var relay = data.relays[0];
            this.fingerprint = relay.fingerprint;
            // Parse the write history of the relay
            var history = relay.write_history;
            _.each(_.keys(relay.write_history), function(period, i) {
                var first = history[period].first.split(' ');
                var date = first[0].split('-');
                var time = first[1].split(':');
                //console.log(date);
                //console.log(time);
                first = new Date(date[0], date[1]-1, date[2],
                                time[0], time[1], time[2]);
                var y = first.getTime();

                _.each(history[period].values, function(value, i) {
                    var x = value*history[period].factor;
                    y += history[period].interval*1000;

                    // This is quite a hack to conform to backbone.js
                    // funky way of setting and getting attributes in
                    // models.
                    // XXX probably want to refactor.
                    var mperiod = period.split("_")[1]
                    var newar = model.get(mperiod).write;
                    newar.push([y,x]);
                    var toset = {mperiod: {write: newar}};
                    model.set(toset);
                });
            });

            var history = relay.read_history;
            _.each(_.keys(relay.read_history), function(period, i) {
                var first = history[period].first.split(' ');
                var date = first[0].split('-');
                var time = first[1].split(':');
                first = new Date(date[0], date[1]-1, date[2],
                                time[0], time[1], time[2]);
                var y = first.getTime();
                _.each(history[period].values, function(value, i) {
                    var x = value*history[period].factor;
                    y += history[period].interval*1000;
                    var mperiod = period.split("_")[1]
                    var newar = model.get(mperiod).read;
                    newar.push([y,x]);
                    var toset = {mperiod: {read: newar}};
                    model.set(toset);
                });
            });
        }
    })
    return graphModel;
});

