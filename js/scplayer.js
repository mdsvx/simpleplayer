/*
 *
 * This module handles : 
 *
 * 		.audio playback
 *			.playback states
 *
 */

define( 'scplayer', ['jquery'], function($) {
		/* properties definition and default values */
		var objLoadedTrack;							/* soundManager(SM2) object */
		var playbackVolume;							/* current volume (0-100) */
		var isTrackLoaded = false;					/* there's a track in the player */
		var isTrackLoadComplete = false;		/* stream completely loaded */
		var volumeIsMuted = false;
		var playbackTimer = 0;						/* setTimeout for displaying track time */
		var loadingStateTimer = 0;					/* setTimeout for checking track loading status 
																 * status info:  0 = uninitialised 
																 *				 1 = loading 
																 *				 2 = failed/error 
																 *			 	 3 = loaded/success  
																 */
		var stopPlayback = function() {
				/* stop/unload current track */
				if (!isTrackLoadComplete) {  clearInterval(loadingStateTimer); }
				objLoadedTrack.stop();
				objLoadedTrack.unload();
				isTrackLoadComplete = false;
				isTrackLoaded = false;
				/* refresh player UI */
				$('#play_bttn span.glyphicon').removeClass('glyphicon-pause');
				$('#play_bttn span.glyphicon').addClass('glyphicon-play');
				//$('#playlist a[data-playlist-index="' + playbackTrackIndex + '"]').removeClass('active');
				
				clearInterval(playbackTimer);
				//clearPlaybackInfo();
				
			}; /* stopPlayback end */	
			
		return {
			/* public */
			stopPlayback : stopPlayback,
			
			playbackActive: function() { 
				return  ( $('#play_bttn > span').hasClass('glyphicon-pause') );				
			},
			
			trackLoaded: function() {
				return isTrackLoaded;
			},
			
			getPlaybackVolume: function() { 
				return playbackVolume; 
			},	
				
			getMuteStatus : function() {
				return volumeIsMuted;
			},
			
			/* modify props values */
			changeVolume: function(newValue) {
				playbackVolume = newValue;
				objLoadedTrack.setVolume(playbackVolume);			
			},
			
			mute: function() {
				volumeIsMuted = true;
				objLoadedTrack.mute();
			},
			
			unmute: function() {
				volumeIsMuted = false;
				objLoadedTrack.unmute();
			},
			
			
/* * PLAYER  FUNCTIONS * */
			
			playTrack : function(track_id) 
			{
				/* sound stream */
				SC.stream('/tracks/' + track_id,{/* options */ autoPlay: false }, 
				function(sound)	/*callback*/
				{
					/* sound object */
					objLoadedTrack = sound;				
					objLoadedTrack.play();
					playbackVolume = localStorage.getItem("volume") || 50;
					objLoadedTrack.setVolume(playbackVolume);
					isTrackLoaded = true;
					
					/* player UI mods */
					$('.players_controls .playerButton').removeClass('inactive');
					$('#play_bttn span.glyphicon').removeClass('glyphicon-play');
					$('#play_bttn span.glyphicon').addClass('glyphicon-pause');						
					
					/* waiting for track to be completely loaded */						
					loadingStateTimer = setInterval(function waitTrackLoading() {
						var loadAlert = "<div class='alert alert-danger alert-dismissable'>\
										<button type='button' class='close' data-dismiss='alert' \
										aria-hidden='true'>&times;</button>Error while loading track.</div>";
										
						var loadComplete = "<div class='alert alert-success alert-dismissable'>\
										<button type='button' class='close' data-dismiss='alert' \
										aria-hidden='true'>&times;</button>Track completely loaded !</div>";
						/* Loading statuses : 
						 *	0 = uninitialised
						 *	1 = loading
						 *	2 = failed/error
						 *	3 = loaded/success
						 */
						if(objLoadedTrack.readyState == 2){										
							$('#main').prepend(loadAlert);
							clearInterval(loadingStateTimer);
						}	
						if(objLoadedTrack.readyState == 3){
							$('#main').prepend(loadComplete);
							clearInterval(loadingStateTimer);
							/* ... actions to perform when track is completely loaded */
							isTrackLoadComplete = true;
						}						
					},100);		
					
					/* timer doesnt restart after playback stop */
					playbackTimer = setInterval(function displayTrackTime() {
						var pos = objLoadedTrack.position / 1000;
						var seconds = Math.floor(pos % 60);
						if(seconds < 10) {seconds = '0' + seconds;}
						var minutes = Math.floor((pos %= 3600) / 60);
						$('#custom_player .track-time').html(minutes + ':' + seconds);
					  },500);						  
					
					/* Todo: when finished play next playlist index */
					
				});				
			}, /* playTrack end */
			
			pauseCurrentTrack: function() {
				objLoadedTrack.pause();
			},
			
			resumeCurrentTrack: function() {
				objLoadedTrack.resume();
			},
			
			setPlaybackVolume: function(value) {
				objLoadedTrack.setVolume(value);
			},
			setTrackPosition: function(value) {
				// add tests : value must be a nb / value must not exceed track's total  length
				// value is in millisec
				objLoadedTrack.setPosition(value);
			}
			
   /* * --PLAYER  FUNCTIONS * */
  /* * * * * * * * * * * * * */
 
		}; /* return end */
		
}); /* define function end */
