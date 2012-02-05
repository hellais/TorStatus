// ~ main.js ~
// Main GLClient starter
// based on work done by @jrburke
// Configure require.js shortcut aliases
require.config({
  paths: {
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-optamd3-min',
    text: 'libs/require/text',
    datatables: 'libs/datatables/jquery.dataTables.min',
    datatablest: 'libs/datatables/dataTables.TorStatus',
    tooltip: 'libs/bootstrap/bootstrap-tooltip',
    typeahead: 'libs/bootstrap/bootstrap-typeahead',
    popover: 'libs/bootstrap/bootstrap-popover',
    flot: 'libs/flot/jquery.flot',
    templates: '../templates'
  }

});

require([

  // Load our app module and pass it to our definition function
  'app'

  // Some plugins have to be loaded in order due to their non AMD compliance
  // Because these scripts are not "modules" they do not pass any values to the definition function below
], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});
