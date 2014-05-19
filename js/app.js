/* TODO : 
 *
 *     Load tracks from JSON file, not localstorage
 *
 *     Trigger function when track finished ( SM2 event not working correctly )
 *
 *     Add a 'search tracks' page, make a playlist by selecting tracks and save it to a jsonfile then send tracks ids to player	
 *      ... or create remove buttons on each track list lines + add track functionality (?) 
 *
 */	 
 // for css transitions detection
 function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}	
// requireJS conf
require.config({
   paths : {
      'jquery' : 'libs/jquery.min',
	  'bootstrap' : 'libs/bootstrap.min',
	  'bsSlider' : 'libs/bootstrap-slider'
   },
   shim: {
        "bootstrap": ["jquery"],
		"bsSlider": ["jquery"]
    }
});

// main app
require([ "jquery", "bootstrap", "bsSlider", "scplayer", "scplayer.gui", "tracklist.mgr", "storage" ], 
	function($, bootstrap, bsSlider, scplayer, playerGUI, tracklistManager, storage) {
	
		// init soundcloud API
		SC.initialize({
		  client_id: '220511b3281df22b3dbad41886046b33',
		   redirect_uri: '#'
		});
		
		$(document).ready(function(){
			// assign player GUI functions
			playerGUI.initControls();
			
			// set dom selectors, obj keys ...
			tracklistManager.setTracksTableSelector('#results-table > tbody');
			tracklistManager.setResultsSelector('#results-table tr.track-row');
			var tracklistKey = 'scPlayerTracks';
			
			// import/export/clear buttons
			$('#import').tooltip();
			$('#export').tooltip();
			$('#clear').tooltip();
			
			$('#import').on('click',function() {
				tracklistManager.loadJTrackList( storage.retrieveObject(tracklistKey), function() {
					if ( !$('.col-xs-0.col-sm-3').hasClass('visible') ) {
						$('.col-xs-0.col-sm-3').addClass("visible"); 
					}
				});				
			});
			
			$('#export').on('click',function() {
				if( $( tracklistManager.getResultsSelector() ).length ) { 
					/* code if element found */ 
					storage.storeObject( tracklistKey, tracklistManager.makeJTrackList() );
				} else { 
					/* code if not found */ 
					// use bs popovers ??
					$('#main').prepend("<div class='alert alert-warning alert-dismissable'>\
										<button type='button' class='close' data-dismiss='alert' \
										aria-hidden='true'>&times;</button>No tracks to be saved !</div>");
				}				
			});
			
			$('#clear').on('click',function() {						
				if( $( tracklistManager.getResultsSelector() ).length ) { 
					var transitionEnd = whichTransitionEvent();
					$('.col-xs-0.col-sm-3').on(transitionEnd, function() {
						$( tracklistManager.getResultsSelector() ).remove();
						$('.col-xs-0.col-sm-3').off();
					});
					if ( $('.col-xs-0.col-sm-3').hasClass('visible') ) {
						$('.col-xs-0.col-sm-3').removeClass("visible"); 
					}					
				} else { 
					$('#main').prepend("<div class='alert alert-warning alert-dismissable'>\
										<button type='button' class='close' data-dismiss='alert' \
										aria-hidden='true'>&times;</button>No tracks to be cleared !</div>");
				}	
			}); // --clearClick
			// --import/export/clear buttons
			
		});// --docready				
});// --require
