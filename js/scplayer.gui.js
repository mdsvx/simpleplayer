/*
 * Handling player GUI
 *
 */

define( 'scplayer.gui', /* module_id */
		['jquery','scplayer'], /* dependencies */
		function($,scplayer) {
		
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
					if ( scplayer.trackLoaded() ) {
						playPreviousTrack();
					}
				});
				/* NEXT TRACK */
				$('#player_next').click(function(e) {
					e.preventDefault();
					if ( scplayer.trackLoaded() ) {
						playNextTrack();
					}
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
				$('#results-display').on("click","tr.track-row",function(e) {
					e.preventDefault();
					var playMeId = $(this).data('track-id');
					
					if ( scplayer.trackLoaded() ) {
						scplayer.stopPlayback();
					}
					scplayer.playTrack(playMeId);								
					displayTrackInfo(playMeId);
				});	
			
			} /* initControls end */
 
		}; /* return end */
		
}); /* define function end */
