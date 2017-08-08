jQuery(document).ready(function($){
	var resizing = false,
		navigationWrapper = $('.uxbox-main-nav-wrapper'),
		navigation = navigationWrapper.children('.uxbox-main-nav'),
		mainNav = $('.uxbox-main-nav'),
		logoType = $('.uxbox-logo'),
		searchForm = $('.uxbox-main-search'),
		pageContent = $('.uxbox-main-content'),
		searchTrigger = $('.uxbox-search-trigger'),
		closeBtn = $('.close'),
		coverLayer = $('.uxbox-cover-layer'),
		navigationTrigger = $('.uxbox-nav-trigger'),
		mainHeader = $('.uxbox-main-header');
		bagTrigger = $('.uxbox-bag-trigger');
		searchSuggestions = $('.uxbox-search-suggestions');
		body = $('body');

	function checkWindowWidth() {
		var mq = window.getComputedStyle(mainHeader.get(0), '::before').getPropertyValue('content').replace(/"/g, '').replace(/'/g, "");
		return mq;
	}

	function checkResize() {
		if( !resizing ) {
			resizing = true;
			(!window.requestAnimationFrame) ? setTimeout(moveNavigation, 300) : window.requestAnimationFrame(moveNavigation);
		}
	}

	function moveNavigation(){
  		var screenSize = checkWindowWidth();
        if ( screenSize == 'desktop' && (navigationTrigger.siblings('.uxbox-main-search').length == 0) ) {

        	//desktop screen - insert navigation and search form inside <header>
        	searchForm.detach().insertBefore(navigationTrigger);
					navigationWrapper.detach().insertBefore(searchForm).find('.uxbox-serch-wrapper').remove();
					logoType.removeClass('uxbox-logo-mobile');
					bagTrigger.detach().insertBefore(mainNav).removeClass('uxbox-bag-trigger-mobile');
					searchTrigger.detach().insertBefore(mainNav).removeClass('uxbox-search-trigger-mobile');

		} else if( screenSize == 'mobile' && !(mainHeader.children('.uxbox-main-nav-wrapper').length == 0)) {

			//mobile screen - move navigation and search form after .uxbox-main-content element
			navigationWrapper.detach().insertAfter('.uxbox-main-content');
			var newListItem = $('<li class="uxbox-serch-wrapper"></li>');
			searchForm.detach().appendTo(newListItem);
			newListItem.appendTo(navigation);

			bagTrigger.detach().appendTo(mainHeader).addClass('uxbox-bag-trigger-mobile');
			searchTrigger.detach().insertBefore(searchSuggestions).addClass('uxbox-search-trigger-mobile');
			logoType.addClass('uxbox-logo-mobile');
		}

		resizing = false;
	}

	function closeSearchForm() {
		searchTrigger.removeClass('search-form-visible');
		searchForm.removeClass('is-visible');
		coverLayer.removeClass('search-form-visible');
		body.removeClass('search-form-active');
	}

	//add the .no-pointerevents class to the <html> if browser doesn't support pointer-events property
	( !Modernizr.testProp('pointerEvents') ) && $('html').addClass('no-pointerevents');

	//move navigation and search form elements according to window width
	moveNavigation();
	$(window).on('resize', checkResize);

	//mobile version - open/close navigation
	navigationTrigger.on('click', function(event){
		event.preventDefault();
		mainHeader.add(navigation).add(pageContent).toggleClass('nav-is-visible');
	});

	searchTrigger.on('click', function(event){
		event.preventDefault();
		if( searchTrigger.hasClass('search-form-visible') ) {
			searchForm.find('form').submit();
		} else {
			searchTrigger.addClass('search-form-visible');
			body.addClass('search-form-active');
			coverLayer.addClass('search-form-visible');
			searchForm.addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				searchForm.find('input[type="search"]').focus().end().off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
			});
		}
	});

	//close search form
	searchForm.on('click', '.close', function(event){
		event.preventDefault();
		closeSearchForm();
	});

	coverLayer.on('click', function(){
		closeSearchForm();
	});

	$(document).keyup(function(event){
		if( event.which=='27' ) closeSearchForm();
	});

	//upadate span.selected-value text when user selects a new option
	searchForm.on('change', 'select', function(){
		searchForm.find('.selected-value').text($(this).children('option:selected').text());
	});
});
