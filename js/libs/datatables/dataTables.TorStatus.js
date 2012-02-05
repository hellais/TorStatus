//	There may be occasions when you wish to filter data presented to
//	the end user in your own manner, common examples are number range
//	filtering (in between two numbers) and date range filtering.
//	DataTables provide an API method to add your own filtering functions,
//	$.fn.dataTableExt.afnFiltering. This is an array of functions
//	(push your own onto it) which will will be run at table draw time
//	to see if a particular row should be included or not.


/* Custom filtering function which will filter data in column four between two values */

$.fn.dataTableExt.afnFiltering.push(
	function( oSettings, aData, iDataIndex ) {
		var iMin = document.getElementById('bw_from').value * 1;
		var iMax = document.getElementById('bw_from').value * 1;
        console.log("iMin: "+iMin+" iMax: "+iMax);
        console.log(aData);
		var iVersion = aData[3] == "-" ? 0 : aData[3]*1;

		if ( iMin == "" && iMax == "" )
		{
			return true;
		}
        else if ( iMin == "" && iVersion < iMax)
        {
            return true;
        }
        else if ( iMin < iVersion && "" == iMax )
        {
            return true;
        }
        else if ( iMin < iVersion && iVersion < iMax )
        {
            return true;
        }
        return false;
    }
);

/*
$(document).ready(function() {
    var oTable = $('#example').dataTable();

    $('#min').keyup( function() { oTable.fnDraw(); } );
    $('#max').keyup( function() { oTable.fnDraw(); } );
} );
*/

$.extend( $.fn.dataTableExt.oStdClasses, {
    "sSortAsc": "header headerSortDown",
    "sSortDesc": "header headerSortUp",
    "sSortable": "header"
} );


