/*!
 jQuery Mobile fixedtoolbar polyfill for blacklisted browsers that don't natively support position:fixed
 Author @scottjehl
 Copyright 2012 Filament Group, Inc.
 License Dual MIT or GPLv2
*/
(function( $, undefined ) {

	// If the supportBlacklist is returning true, it's a blacklisted browser. 
	if( $.mobile.fixedtoolbar.prototype.options.supportBlacklist() && $.support.scrollTop ){

		// Keep a reference to the original _create method
		var oldcreate = $.mobile.fixedtoolbar.prototype._create,

			// Additional scripting to add to the _create method for polyfilling unsupported browsers
			createPolyfill = function(){

				if( this.options.polyfillSupport === true ){

					var toolbar = this.element,
						tbType = toolbar.hasClass( "ui-header-fixed") ? "header" : "footer",
						page = toolbar.closest( ":jqmData(role='page')" );

						// Add faux support class to toolbar
						toolbar.addClass( "ui-fixed-faux" );

						// set up a function that resets the top or bottom value, depending on toolbar type
						var resetPos = (function(){
							if( tbType === "header" ){
								return function(){
									toolbar.css( "top", $( window ).scrollTop() + "px" );
								};	
							}
							else {
								return function(){

									toolbar.css( "bottom", page.outerHeight() - $( window).scrollTop() - $.mobile.getScreenHeight() + "px" );
								}
								
							}
						})();
						
						this._updatePosition = resetPos;
						$.mobile.fixedtoolbar.prototype.updatePosition = function(){
							this._updatePosition();
						};

						// Per page show, re-set up the event handling
						page.bind( "pagebeforeshow", function( e ){
							var visible,
								onscrollstart = function(){
									visible = toolbar.not( ".ui-fixed-hidden" ).fixedtoolbar( "hide", true );
								},
								onscrollstop = function(){
									resetPos();
									visible.fixedtoolbar( "show" );
								},
								onthrottledresize = function(){
									resetPos();
								},
								scrolltarget = ( $( document ).scrollTop() === 0 ) ? $( window ) : $( document );

							// Normalize proper object for scroll event
							scrolltarget
								.bind( "scrollstart.fixedtoolbarpolyfill", onscrollstart)
								.bind( "scrollstop.fixedtoolbarpolyfill", onscrollstop);

							// on resize, reset positioning
							$( window ).bind( "throttledresize.fixedtoolbarpolyfill", onthrottledresize );

							// on pagehide, unbind the event handlers
							page.one( "pagehide", function(){
								scrolltarget
									.unbind( "scrollstart.fixedtoolbarpolyfill", onscrollstart)
									.unbind( "scrollstop.fixedtoolbarpolyfill", onscrollstop);
								$( window ).unbind( "throttledresize.fixedtoolbarpolyfill", onthrottledresize );
							});

							// align for pageshow
							resetPos();
					});
				}
			};

		// Set the blacklist test return false, letting any normally-blacklisted browsers in to be polyfilled
		$.mobile.fixedtoolbar.prototype.options.supportBlacklist = function(){
			return false;
		};

		// Define a new option for polyfillSupport, which can be disabled per call or via data attr data-polyfill-support
		$.mobile.fixedtoolbar.prototype.options.polyfillSupport = true;

		// Overwrite the _create method with the old and the new
		$.mobile.fixedtoolbar.prototype._create = function(){

			// Call the old _create method.
			oldcreate.call( this );

			// Call the polyfill scripting
			createPolyfill.call( this );
		};
	}

})( jQuery );