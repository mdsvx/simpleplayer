/*
 * This module handles the tracklist
 */
define( 'tracklist.mgr', ['jquery'], function($) {
		var resultsSelector;				// where search results will be dsiplayed
		var tracksTableSelector;		// where playlist will be loaded
		
		return {
		
			// SETS
			setResultsSelector: function(newValue) {
				resultsSelector = newValue;		
			},
			
			setTracksTableSelector: function(newValue) {
				tracksTableSelector = newValue;		
			},
			
			// GETS
			getResultsSelector: function(newValue) {
				return resultsSelector;		
			},
			
			getTracksTableSelector: function(newValue) {
				return tracksTableSelector;		
			},
		
			// Turn html table data into json object
			makeJTrackList: function() {
			
				var jsonTrackList = {  "trackList": [ ] 	};
				
				// TODO turn selectors into vars
				$(resultsSelector).each(function() {				
					var trackId = $(this).data('track-id');
					var imageUrl = $(this).find('td.track-image > img').attr('src');
					var trackUser = $(this).find('td.track-artist > p').html();
					var trackTitle = $(this).find('td.track-title > p').html();
					
					var jTrackStr = '{"id":' + trackId 
									+ ', "trackUser":"' + trackUser 
									+ '","trackTitle":"' + trackTitle 
									+ '","imageUrl":"' + imageUrl + '"}';			
					
					jsonTrackList['trackList'].push(JSON.parse(jTrackStr));
				});
				
				return jsonTrackList;
				
		  }, // --makeJTrackList
		  
		  // Load tracklist from json object into 'tracksTableSelector' table
		  loadJTrackList : function(jTrackList) {
		  
			$.each(jTrackList["trackList"], function(index,item) {				
				var newRow = '<tr data-track-id="' + item.id + '" class="track-row ' + index + '">'  +
								'<td class="track-image "><img src="' + item.imageUrl + '"></td>' +
								'<td class="track-artist"><p class="p-trackUser">' + item.trackUser + '</p></td>' +
								'<td class="track-title"><p class="p-trackTitle">' + item.trackTitle + '</p></td></tr>';
				$(tracksTableSelector).append(newRow);
				
			});
		  
		  } // --loadJTrackList
		  
		}; /* return end */
		
}); /* define function end */