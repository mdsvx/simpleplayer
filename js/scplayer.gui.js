/*
 * Handling player GUI
 * TODO: add vars and their access functions for $electors
 */

define( 'scplayer.gui', /* module_id */
		['jquery', 'scplayer', 'tracklist.mgr'], /* dependencies */
		function($, scplayer, tracklistManager) {
		
		var displayTrackInfo = function(track_id) {
			/* display track info in player */				
			SC.get('/tracks/' + track_id, function(track) {
				$('#custom_player .custom_player_title').html(track.user.username + ' - ' + track.title);
				$('#custom_player .custom_player_title').addClass('filled');
				$('#custom_player .custom_player_title').removeClass('empty'); 
				displayTotalTime(track.duration);			
			});		
			$('#custom_player .player-info').show(400);
		}; /*function displayTrackInfo*/
		
		var displayTotalTime = function(duration) {		
			var totalTime = duration / 1000;
			var seconds = Math.floor(totalTime % 60);
			if(seconds < 10) {seconds = '0' + seconds;}
			var minutes = Math.floor((totalTime %= 3600) / 60);
			$('#custom_player .total-time').html('&nbsp;/&nbsp;' + minutes + ':' + seconds);
		};/*function displayTotalTime*/
		
		var clearPlaybackInfo = function() {
			$('#custom_player .player-info').hide(200);
			$('#custom_player .custom_player_title').html('');
			$('#custom_player .custom_player_title').addClass('empty');
			$('#custom_player .custom_player_title').removeClass('filled'); 
			$('#custom_player .total-time').html('0:00');
			$('#custom_player .track-time').html('0:00');
		};
		
		var playPreviousTrack = function() {
		
			// if a track is loaded and it is not the first in the list
			// add or replace first test to check if np class is present
				if ( scplayer.trackLoaded() && !$('.now-playing').hasClass('0') ) {
					
					var playMeId = $('.now-playing').prev().data('track-id');					
					$('.now-playing').removeClass('now-playing');
					$('tr.track-row[data-track-id="' +  playMeId + '"] ').addClass('now-playing');
					
					scplayer.stopPlayback();
					scplayer.playTrack(playMeId);	
					displayTrackInfo(playMeId);
					
				} else if ( $('.now-playing').hasClass('0') ) {
					// play track from beginning
					scplayer.setTrackPosition(0);
				}
	
		};
		
		var playNextTrack = function() {
		
			var indiceMax = $( tracklistManager.getResultsSelector() ).length - 1;
			// if a track is loaded and it is not the last in the list
			if ( scplayer.trackLoaded() && !$('.now-playing').hasClass(indiceMax) ) {
			
				var playMeId = $('.now-playing').next().data('track-id');
				$('.now-playing').removeClass('now-playing');
				$('tr.track-row[data-track-id="' +  playMeId + '"] ').addClass('now-playing');
				
				scplayer.stopPlayback();
				scplayer.playTrack(playMeId);			
				displayTrackInfo(playMeId);
			}
		};

		return {
			displayTrackInfo : displayTrackInfo,
			displayTotalTime : displayTotalTime,
			clearPlaybackInfo : clearPlaybackInfo,
			
			initControls: function() 
			{
				/* initialize all player buttons' actions */
				
				/* CLASSIC EVENTS */
				/* PLAY */
				$('#play_bttn').click(function(e) {
				  e.preventDefault();
				  
				    /* if playing the button displays the pause icon .. */
					if($('#play_bttn > span').hasClass('glyphicon-pause')){
					
						scplayer.pauseCurrentTrack();						
						$('#play_bttn span.glyphicon').removeClass('glyphicon-pause');
						$('#play_bttn span.glyphicon').addClass('glyphicon-play');						
					} else { 					
						/* this part should resume or play loaded track or 1st track in playlist */
						scplayer.resumeCurrentTrack();
						$('#play_bttn span.glyphicon').addClass('glyphicon-pause');
						$('#play_bttn span.glyphicon').removeClass('glyphicon-play');	
					}						  
				});
				
				/* PREVIOUS TRACK */
				$('#player_prev').click(function(e) {
					e.preventDefault();					
					playPreviousTrack();
				});
				/* NEXT TRACK */
				$('#player_next').click(function(e) {
					e.preventDefault();
					playNextTrack();
				});
				
				/* Volume controls */
				/* SLIDER */
				var lastVolume = localStorage.getItem("volume") || 50;
				/* init boostrap slider */
				$('#volumeControl').slider({
					tooltip: 'hide'
				});
				/* set to last volume */
				$('#volumeControl').slider('setValue',lastVolume);
				/* change and store volume on slide */
				$('#volumeControl').on('slide', function(event) {
					if (scplayer.trackLoaded()) { 
						scplayer.setPlaybackVolume(event.value); 
					}	
					localStorage.setItem("volume",event.value);
				});	
				
				/* MUTE */
				$('#mute').click(function(e) {
					e.preventDefault();
					if (scplayer.getMuteStatus()) {					
						scplayer.unmute();
						$('#mute span.glyphicon').removeClass('glyphicon-volume-off');
						$('#mute span.glyphicon').addClass('glyphicon-volume-up');
					} else {						
						scplayer.mute();
						$('#mute span.glyphicon').removeClass('glyphicon-volume-up');				
						$('#mute span.glyphicon').addClass('glyphicon-volume-off');
					}
				});
				
				/* DELEGATE EVENTS */		
				/* tracklist click */
				$('#results-display').on("click","tr.track-row",function(e) {
					e.preventDefault();
					if ( !$(this).hasClass('now-playing') ) {
						// remove np class if a track is already loaded and stop audio playback
						if (scplayer.trackLoaded()) { 
							$('.now-playing').removeClass('now-playing');
							scplayer.stopPlayback();
						}	
						// add it to the new track to be loaded
						$(this).addClass('now-playing');
						//fetch track id from row data then play track
						var playMeId = $(this).data('track-id');						
						scplayer.playTrack(playMeId);								
						displayTrackInfo(playMeId);
					}
				});	
			
			} /* initControls end */
 
		}; /* return end */
		
}); /* define function end */
