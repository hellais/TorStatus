// This is the boilerplate file
// it should be used as a base for every module
define([
  'jquery',
  'underscore',
  'backbone',
  'models/relay',
  'models/graph',
  'text!templates/details/main.html',
  'tooltip',
  'popover',
  'flot',
  'helpers'
], function($, _, Backbone, relayModel, graphModel, mainDetailsTemplate){
    var mainDetailsView = Backbone.View.extend({
        el: $("#content"),
        initialize: function() {
           this.model = new relayModel;
           this.graph = new graphModel;
           //console.log(this.graph);
           $("#loading").show();
        },
        render: function() {
            var data = {relay: this.model};
            //console.log(data);
            var compiledTemplate = _.template(mainDetailsTemplate, data);
            this.el.html(compiledTemplate);
            var graph = this.graph;
            this.graph.lookup(this.model.fingerprint, {
                success: function() {
                    graph.parsebwdata(graph.data);
                    //console.log(graph.get('days').write);
                    function showTooltip(x, y, contents) {
                        $('<div id="graphtooltip">' + contents + '</div>').css( {
                            position: 'absolute',
                            display: 'none',
                            top: y - 25,
                            left: x + 5,
                            border: '1px solid #fdd',
                            padding: '2px',
                            'background-color': '#fee',
                            opacity: 0.80
                        }).appendTo("body").fadeIn(200);
                    }
                    graphs = ['days', 'week', 'month',
                            'months', 'year', 'years'];
                    _.each(graphs, function(g) {
                        $.plot($("#"+g),
                            [{data: graph.get(g).write, label: 'write'},
                              {data: graph.get(g).read, label: 'read'}], {
                                series: {
                                    lines: {show: true},
                                    points: {show: true},
                                    },
                                grid: { hoverable: true, clickable: true },
                                xaxis: {mode: 'time', tickLength: 5},
                        });

                        var previousItem = null;
                        $("#"+g).bind("plothover", function (event, pos, item){
                            if (item) {
                                if (previousItem != item.dataIndex) {
                                    previousItem = item.dataIndex;

                                    $("#graphtooltip").remove();
                                    var x = item.datapoint[0].toFixed(2),
                                        y = item.datapoint[1].toFixed(2);
                                    var bw = hrBandwidth(item.datapoint[1]);
                                    showTooltip(item.pageX, item.pageY,
                                                bw);

                                }
                            } else {
                                $("#graphtooltip").remove();
                                previousItem = null;
                            }
                        });
                    });
                }
            });

            $("#loading").hide();
            $(".flag .tooltip").hide();
            $(".tip").popover();
            $(".flag").hover(function(){
                $(this).children(".tooltip").show();

            }, function(e){

                $(this).children(".tooltip").hide();

            });
        }
    });
    return new mainDetailsView;
});

