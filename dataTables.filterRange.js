/*
 * File:        dataTables.filterRange.js
 * Version:     1.0.0-dev
 * CVS:         $Id$
 * Description: Allow serverside and local filtering using a range of values
 * Author:      Leif Ashby
 * Created:     Fri Mar 14 16:36:45 EST 2014
 * Modified:    $Date$ by $Author$
 * Language:    Javascript
 * License:     GPL v2 or BSD 3 point style
 * Project:     DataTables
 * Contact:     www.forestgiant.com
 *
 * Copyright 2014 Forest Giant, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD style license, available at:
 *   http://datatables.net/license_gpl2
 *   http://datatables.net/license_bsd
 *
 */

(function($, window, document) {

$.fn.dataTableExt.oApi.fnFilterRange = function ( oSettings, sSearchStart, sSearchEnd, iColumn, bRegex, bSmart, bCaseInsensitive )
{
    //Change the aoPreSearch column
    $.extend( oSettings.aoPreSearchCols[ iColumn ], {
        "sSearch": sSearchStart+"",
        "bRegex": bRegex,
        "bSmart": bSmart,
        "bCaseInsensitive": bCaseInsensitive,
        "bRange": !!sSearchStart && !!sSearchEnd,
        "sSearchStart": sSearchStart+"",
        "sSearchEnd": sSearchEnd+""
    } );

    if ( !oSettings.oFeatures.bServerSide )
    {
        oSettings.aoPreSearchCols[ iColumn ].sSearch = "";
    }

    oSettings.oInstance._fnFilterComplete( oSettings.oPreviousSearch, 1 );
};

function fnServerCallback ( sUrl, aoData, fnCallback, oSettings ) {
    for ( var i=0 ; i<oSettings.aoPreSearchCols.length ; i++ )
    {
        if ( oSettings.aoPreSearchCols[i].bRange === true )
        {
            aoData.push({ "name": "bRange_" + i, "value": oSettings.aoPreSearchCols[i].bRange })
            aoData.push({ "name": "sSearchEnd_" + i, "value": oSettings.aoPreSearchCols[i].sSearchEnd })
        }
    }
    
    oSettings.fnOriginalServerCallback( sUrl, aoData, fnCallback, oSettings );
};

function fnLocalRangeFilter ( oSettings, aData, iDataIndex ) {
    /* Only do the individual column filter */
    for ( var i=0 ; i<oSettings.aoPreSearchCols.length ; i++ )
    {   
        console.log(i, "bRange", oSettings.aoPreSearchCols[i].bRange);
        if ( oSettings.aoPreSearchCols[i].bRange === true )
        {            
            if ( aData[i] < oSettings.aoPreSearchCols[i].sSearchStart || aData[i] > oSettings.aoPreSearchCols[i].sSearchEnd )
            {
                return false;
            }
        }
    }
    return true;
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * Register a new feature with DataTables
 */
if ( typeof $.fn.dataTable == "function" &&
     typeof $.fn.dataTableExt.fnVersionCheck == "function" &&
     $.fn.dataTableExt.fnVersionCheck('1.9.3') )
{
    $.fn.dataTableExt.aoFeatures.push( {
        "fnInit": function( settings ) {
            
            //Set override for serverdata callback
            settings.fnOriginalServerCallback = settings.fnServerData;
            settings.fnServerData = fnServerCallback;

            //Push a range filter for local filtering
            $.fn.dataTableExt.afnFiltering.push( fnLocalRangeFilter );

            return null; /* No node for DataTables to insert */
        },
        "cFeature": "F",
        "sFeature": "FilterRange"
    } );
}
else
{
    alert( "Warning: FilterRange requires DataTables 1.9.3 or greater - www.datatables.net/download");
}

})(jQuery, window, document);