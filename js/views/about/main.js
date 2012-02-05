// This is the boilerplate file
// it should be used as a base for every module
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/about.html',
  'popover',
  'tooltip'
], function($, _, Backbone, aboutTemplate){
    var aboutView = Backbone.View.extend({
        el: $("#content"),
        initialize: function() {
        },
        render: function() {
            var data = {};
            var compiledTemplate = _.template(aboutTemplate, data);
            this.el.html(compiledTemplate);
            //$("#loading").hide();
            //$(".flag .tooltip").hide();
            //$(".tip").popover();
            $(".flag").hover(function(){
                $(this).children(".tooltip").show();

            }, function(e){

                $(this).children(".tooltip").hide();

            });
        }
    });
    return new aboutView;
});

