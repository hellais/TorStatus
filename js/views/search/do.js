// ~ views/search/do ~
define([
  'jquery',
  'underscore',
  'backbone',
  'collections/results',
  'text!templates/search/do.html',
  'datatables',
  'tooltip',
  'helpers',
  'typeahead'
], function($, _, Backbone, resultsCollection, doSearchTemplate){
  var doSearchView = Backbone.View.extend({
	    el: $("#content"),
	    initialize: function() {
	    	this.collection = new resultsCollection;
	    	$("#loading").show();
	    },
        filtering: function() {
            var rangefilter = function(data) {
                var iMin = document.getElementById(data.ida).value;
                var iMax = document.getElementById(data.idb).value;

                if ( iMin == "" && iMax == "") {
                    //console.log("True!")
                    //console.log("RAW: "+rawdata);
                    //console.log("iMin: "+iMin+" iMax: "+iMax);
                    //console.log("datafilter:"+datafilter);
                    return true;
                } else {
                    var rawdata = $(data.aData[data.i]).attr('data-filter');
                    var datafilter = data.transform(rawdata);
                }

                if ( iMin == "" && datafilter < iMax*1) {
                    //console.log("True!")
                    //console.log("RAW: "+rawdata);
                    //console.log("iMin: "+iMin+" iMax: "+iMax);
                    //console.log("datafilter:"+datafilter);
                    return true;
                } else if (iMin*1 <= datafilter && "" == iMax) {
                    //console.log("True!")
                    //console.log("RAW: "+rawdata);
                    //console.log("iMin: "+iMin+" iMax: "+iMax);
                    //console.log("datafilter:"+datafilter);
                    return true;
                } else if (iMin*1 <= datafilter && datafilter <= iMax*1) {
                    //console.log("True!")
                    //console.log("RAW: "+rawdata);
                    //console.log("iMin: "+iMin+" iMax: "+iMax);
                    //console.log("datafilter:"+datafilter);
                    return true;
                }
                //console.log("FALSE!")
                //console.log("RAW: "+rawdata);
                //console.log("iMin: "+iMin+" iMax: "+iMax);
                //console.log("datafilter:"+datafilter);

                return false;

            }
            var imagefilter = function(data) {
                var name = document.getElementById(data.id).value;
                var result = false;
                //console.log(name);
                if ( name == "" ) {
                    //console.log("True!")
                    //console.log("RAW: "+rawdata);
                    //console.log("iMin: "+iMin+" iMax: "+iMax);
                    //console.log("datafilter:"+datafilter);
                    return true;
                } else {
                    var elements = $(data.aData[data.i]);
                }
                _.each(elements, function(el) {
                    var datafilter = $(el).attr('title');
                    if (datafilter != undefined) {
                        //console.log("Datafilter: "+datafilter);
                        var fRegex = new RegExp(datafilter);

                        if (name.match(fRegex)) {
                            console.log("fRegex: "+fRegex);
                            console.log("name: "+name);
                            result |= true;
                        } else {
                            result |= false;
                        }
                    }
                });

                if (result == 1) { console.log('TRUE');return true; }
                else { console.log("FALSE");return false; }
            }

            $.fn.dataTableExt.afnFiltering.push(
                function(oSettings, aData, iDataIndex) {
                    var result = true;
                    // Filter the bandwidth
                    result &= rangefilter({
                        aData: aData,
                        ida: "bw_from",
                        idb: "bw_to",
                        i: 1,
                        transform: function(data) {
                            return Math.round(data/1000);
                            }
                        });
                    // Filter the uptime
                    result &= rangefilter({
                        aData: aData,
                        ida: "uptime_from",
                        idb: "uptime_to",
                        i: 2,
                        transform: function(data) {
                            console.log(data);
                            return Math.floor(data/1000/3600/24);
                            }
                        });

                    result &= imagefilter({
                        aData: aData,
                        id: "country",
                        i: 3
                        });

                    result &= imagefilter({
                        aData: aData,
                        id: "flags",
                        i: 5
                        });

                    //console.log(result);
                    if (result == 1) { return true; }
                    else { return false; }
                }
            );

            $.extend( $.fn.dataTableExt.oStdClasses, {
                "sSortAsc": "header headerSortDown",
                "sSortDesc": "header headerSortUp",
                "sSortable": "header"
            } );


        },
        render: function(query){
            this.filtering();
            var asInitVals = new Array();
        	var compiledTemplate = _.template(doSearchTemplate, {relays: this.relays, countries: CountryCodes});
			this.el.html(compiledTemplate);
	    	$("#loading").hide();
			var fp = this;
			// This creates the table using DataTables
			var oTable = $('#torstatus_results').dataTable({
				// Save the state of the tables
                "sDom": "<'row'<'span6'l><'span6 hide'f>r>t<'row'<'span6'i><'span6'p>>",
				"bStateSave": true
			});
            // Make the tooltips
            $(".flags").tooltip();
            $(".country").tooltip();
            $(".uptime").tooltip();
            // Type ahead for country codes
            $('.typeahead').typeahead({source:_.values(CountryCodes)});
            $('input#flags').typeahead({
                    source: ['Authority', 'Fast', 'Guard', 'HSDir', 'Named',
                            'Running', 'Stable', 'V2Dir', 'Valid', 'Unnamed',
                            'Exit']
            });
            $(".search-query").val(query);

            $("#torstatus_results tbody tr").hover(function() {
                $(this).addClass('hover');
            }, function() {
                $(this).removeClass('hover');
            });

            $("tfoot input#nickname").keyup( function() {
                oTable.fnFilter(this.value, 0);
            });

            $("tfoot input#bw_from").keyup(function() {
                oTable.fnDraw();
            });

            $("tfoot input#bw_to").keyup(function() {
                oTable.fnDraw();
            });

           $("tfoot input#uptime_from").keyup(function() {
                oTable.fnDraw();
            });

           $("tfoot input#uptime_to").keyup(function() {
                oTable.fnDraw();
            });

           $("tfoot input#or_address").keyup(function() {
                oTable.fnFilter(this.value, 4);
           });

           $("tfoot input#or_port").keyup(function() {
                oTable.fnFilter(this.value, 6);
           });

           $("tfoot input#dir_port").keyup(function() {
                oTable.fnFilter(this.value, 7);
           });

           $("tfoot input#flags").keyup(function() {
                oTable.fnDraw();
           });

           $("tfoot input#country").keyup(function() {
                oTable.fnDraw();
           });



        },

	    error: function(err){
	    	var compiledTemplate = _.template(doSearchTemplate, {relays: null, error: err});
	    	$("#loading").hide();
	    	this.el.html(compiledTemplate);
	    }

  });
  return new doSearchView;
});

