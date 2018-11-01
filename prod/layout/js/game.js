/**
 * Memory v1.0
 * Done by Christopher Karger
 * Date: 6.11.16
 */

 ;( function( $, window, document, undefined ) {

 	var Memory = function(options) {
 		var self = this;

		// Count tried cards - not the paired cards
		this.counterTriedPair = 0;

		// Count all tried Cards
		this.counterTurns = 0;

		// Count all found Pairs
		this.counterTurnedPairs = 0;

		// Tried Pair
		this.triedPair = []; 

		/** 
		*	Defaults of memory
		*/
		var defaults = {
			// Where to store data
			url: '/data.php', 

			// Game Selector
			selector: '.memory',

			// Memory Card Pairs
			pairs: 5
		};

		this.options = $.extend({}, defaults, options);

		this.$game = $(options.selector);
		// Return function if selector isn't available
		if ( this.$game.length === 0 ) return;
		
		this.addCards();

		// Save Cardsselector
		this.$cards = $('.memory-card');

		this.$cards.on('click', function(event) {
			self.controller(event);
		});

	};

	Memory.prototype = {

		randomize: function(array) {
			var currentIndex = array.length, 
			temporaryValue, 
			randomIndex;

			while (0 !== currentIndex) {

				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;

				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}

			return array;

		},

		addCards: function() {
			var self = this,
			options = self.options,
			cards = [];

			for ( var a = 0; a < 2; a++ ) {
				for ( var b = 1; b <= options.pairs; b++ ) {
					cards.push(b);
				}
			}

			cards = self.randomize(cards);

			for ( var c = 0; c < cards.length; c++ ) {
				var cardHtml = '<div class="memory-card card' +  cards[c] + '" data-card="' + cards[c] + '"><div class="front"></div><div class="back"></div></div>';
				$(cardHtml).appendTo(self.$game);	
			}

		},

		controller: function(event) {
			var self = this,
			options = self.options,
			$target = $(event.currentTarget),
			checkIfPair,
			isPair;

			if ( $target.data('cardIsVisible') ) {
				return;
			}

			this.counterTriedPair++;
			this.counterTurns++;

			self.showCard($target);
			
			if (self.counterTurns === 1) {
				self.timeStamp = new Date().getTime();
			}

			if ( this.counterTriedPair === 2 ) {
				for ( var i = 0; i < this.triedPair.length; i++ ) {
					var dataPair = this.triedPair[i].attr('data-card');
					
					if ( i === 0 ) {
						checkIfPair = dataPair;
					} else {	
						isPair = ( checkIfPair === dataPair ) ? true : false;
					}

				}

				// If turned cards are a pair
				if ( isPair ) {
					for ( var i = 0; i < this.triedPair.length; i++ ) {
						this.triedPair[i].addClass('turned');
					}
					this.counterTurnedPairs++;
				}
			}
			
			if ( this.counterTurnedPairs === options.pairs ) {				
				self.neededTime = new Date().getTime() - self.timeStamp;
				self.handleData(self.neededTime, this.counterTurns);
			}

		},

		gameEnd: function(result) {
			var self = this,
			neededDate = new Date(this.neededTime),
			endMessage = '<div class="success-message blank-card">';

			endMessage += '<h2>Gratulation!!</h2>';
			endMessage += '<p><span>Benötigte Zeit:</span> ' + neededDate.getUTCHours() + 'h:' + neededDate.getUTCMinutes() + 'm:' + neededDate.getUTCSeconds() + 's</p>';
			endMessage += '<p><span>Benötigte Versuche:</span> ' + this.counterTurns + '</p>';
			endMessage += '<p class="play-again"><a href="#" onclick="location.reload(); return false;">Nochmal spielen</a></p>';
			endMessage += '</div>';

			// Hide Game
			setTimeout(function() {
				self.$game.hide();
				$(endMessage).insertAfter(self.$game);
			}, 650);
			
		},

		handleData: function(time, turns) {
			var self = this,
			options = self.options;

			$.ajax({
				type: 'POST',
				cache: false,
				url: options.url,
				data: {
					action: 'game',
					time: time,
					turns: turns	
				},
				success: function(result) {
					self.gameEnd(result);
				}
			});

		},

		showCard: function($target) {
			var self = this,
			options = self.options;

			if ( this.counterTriedPair > 2 ) {
				this.$cards.removeClass('show').removeData('cardIsVisible');
				this.counterTriedPair = 1;
				this.triedPair = [];
			}

			$target.addClass('show').data('cardIsVisible', 'true'); 
			this.triedPair.push($target);

		}

	};

	window.Memory = Memory;

})( jQuery, window, document );
