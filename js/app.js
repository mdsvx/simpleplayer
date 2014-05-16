/* TODO : 
 *
 *     Load tracks from JSON file, not localstorage
 *
 *     PlayPrev-PlayNext buttons
 *
 *     Trigger function when track finished ( SM2 event not working correctly )
 *
 *     Add a 'search tracks' page, make a playlist by selecting tracks and save it to a jsonfile then send tracks ids to player	
 *      ... or create remove buttons on each track list lines + add track functionality (?) 
 *
 */	
	
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
			
			// import/export buttons
			$('#import').tooltip();
			$('#export').tooltip();
			$('#clear').tooltip();
			
			$('#import').on('click',function() {						
				tracklistManager.loadJTrackList( storage.retrieveObject(tracklistKey) );
				$('#results-table').show(500);  // TODO execute show() after loadjtracklist() is over
			});
			
			$('#export').on('click',function() {
				if( $( tracklistManager.getResultsSelector() ).length ) { 
					/* code if element found */ 
					storage.storeObject( tracklistKey, tracklistManager.makeJTrackList() );
				} else { 
					/* code if not found */ 
					alert('No tracks to be saved !'); // use bs popovers instead
				}
				
			});
			
			$('#clear').on('click',function() {						
				if( $( tracklistManager.getResultsSelector() ).length ) { 
					/* code if element found */ 
					$('#results-table').hide(500);
					$( tracklistManager.getResultsSelector() ).remove();	// TODO execute remove() after hide() is over	
				} else { 
					/* code if not found */ 
					alert('No tracks to be cleared !');
				}	
			});
			
		});// --docready
				
});// --require
