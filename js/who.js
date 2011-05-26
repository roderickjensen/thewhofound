var o_timer;
var o_index = 1;

var addthis_config = {
	services_compact: 'email, delicious, facebook, flickr, google, stumbleuppon, twitter, youtube',
	services_exclude: 'print'
}

var Richmond = function () {
	this.count = 0;
	
	this.spots = [
		'The Jefferson',
		'First Friday art galleries',
		'FLYING SQUIRRELS!',
		'Ellwood Thompson',
		'Monument Ave',
		'James River park system',
		'The National',
		'Virginia Museum of Fine Arts',
		'Grand Illumination'
	];
	
	this.next = this.load = function () {
		richmond.count = (richmond.count > (richmond.spots.length - 1)) ? 1 : richmond.count + 1;

		$('#richmond_images').animate({ opacity: 0 }, function () {
			$('#richmond_images').attr('title', richmond.spots[richmond.count - 1]);
			$('#richmond_images').css('background', 'url(/images/richmond/' + richmond.count + '.jpg) center center no-repeat');
			$('#richmond_images').animate({ opacity: 1 });
		});

		setTimeout('richmond.next()', 5000);
	}
}
richmond = new Richmond();


var Board = function () {
	this.list = []; //holds the currently displayed board members
	this.board_lastswitch = 0;
	
	this.init_timer = function () {
		setTimeout(function () {
			board.random();
		}, 5000);
	};
	
	this.load = function () {
		for (var i = 0;i < 4;i++) {
			var random_member = rand(27);

			while ($.inArray(random_member, this.list) >= 0) {
				random_member = rand(27);
			}

			this.list[i] = random_member;
		}

		$('.meettheboard #images')
			.fadeOut(100, function () {
				$(this)
					.html('<img src="http://media.thewhosearch.com/images/board/' + board.list[0] + '.jpg" /><img src="http://media.thewhosearch.com/images/board/' + board.list[1] + '.jpg" /><img src="http://media.thewhosearch.com/images/board/' + board.list[2] + '.jpg" /><img src="http://media.thewhosearch.com/images/board/' + board.list[3] + '.jpg" />')
					.fadeIn(1000);
		});

		setTimeout('board.init_timer()', 1000);
	};
	
	this.random = function () {
		var random_member = rand(27);

		while ($.inArray(random_member, this.list) >= 0) {
			random_member = rand(27);
		}

		image_to_switch = rand(4);
		while (image_to_switch == this.board_lastswitch) {
			image_to_switch = rand(4);
		}

		this.list[image_to_switch] = random_member;
		this.board_lastswitch = image_to_switch;
		
		image_to_switch = $('.meettheboard #images').find('img')[image_to_switch - 1];
		$(image_to_switch)
			.animate({ opacity: 0}, function () {
				$(this)
					.attr('src','http://media.thewhosearch.com/images/board/' + random_member + '.jpg')
					.animate({ opacity: 1},1000);
		});

		this.init_timer();
	};
}
board = new Board();


var Versus = function () {
	this.candidates = [];
	
	this.load = function () {
		$(document).keydown(function(e){
		    if (e.keyCode == 37) { 
		    	versus.vote('left');
				e.preventDefault();
		    }
			if (e.keyCode == 39) { 
		    	versus.vote('right');
				e.preventDefault();
		    }
		});
		
		$('#whovswho #fighter').live('click', function () {
			versus.vote('left');
		});
		$('#whovswho #challenger').live('click', function () {
			versus.vote('right');
		});
		
		$('#whovswho').css({ opacity: 0 })
		versus.fetch(function () { versus.reset(); });
	};
	
	this.vote = function (leftright) {
		if (leftright == 'left') {
			candidate_id = $('#whovswho #fighter input').val();
		}
		else {
			candidate_id = $('#whovswho #challenger input').val();
		}

		if (candidate_id != '') {
			$('#whovswho input').val(''); //clear the inputs so users cant vote again until the candidates are repopulated

			$.post('/candidates/vote/' + candidate_id);

			if (leftright == 'left') {
				$('#whovswho .check').css({ left: 0, right: '', display: 'block' });
			}
			else {
				$('#whovswho .check').css({ left: '', right: 0, display: 'block' });
			}
			
			this.fetch();
			this.clear();
		}
	};
	
	this.clear = function () {
		$('#fighter .name').animate({ bottom: '15px' }, 'fast');
		$('#fighter .percentage').animate({ bottom: '50px' }, 'fast');

		$('#fighter .name').animate({ bottom: '-335px' }, 'fast');
		$('#fighter .percentage').animate({ bottom: '-300px' });

		$('#challenger .name').animate({ bottom: '15px' }, 'fast');
		$('#challenger .percentage').animate({ bottom: '50px' }, 'fast');

		$('#challenger .name').animate({ bottom: '-335px' }, 'fast');
		$('#challenger .percentage').animate({ bottom: '-300px' }, function () {
			versus.reset();
			versus.unclear();
		});
	};
	
	this.unclear = function () {
		$('#fighter .name').animate({ bottom: '10px' }, 'fast');
		$('#fighter .percentage').animate({ bottom: '40px' }, 'fast');

		$('#fighter .name').animate({ bottom: '35px' }, 'fast');
		$('#fighter .percentage').animate({ bottom: '5px' }, 'fast');

		$('#challenger .name').animate({ bottom: '10px' }, 'fast');
		$('#challenger .percentage').animate({ bottom: '40px' }, 'fast');

		$('#challenger .name').animate({ bottom: '35px' }, 'fast');
		$('#challenger .percentage').animate({ bottom: '5px' }, 'fast');
	};
	
	this.fetch = function (after) {
		var first_candidate;

		//display two random candidates for the Versus box.
		$.getJSON('candidates.json', function(candidates) {
			versus.candidates = candidates;
			
			if (typeof after == 'function') {
				after();
			}
		});
	}
	
	this.reset = function (after) {				
		//get our first fighter
		first_candidate = rand(this.candidates.length - 1);
        
		//get another fighter that isn't the same as the first
		while ((id = rand(this.candidates.length - 1)) != first_candidate && typeof(second_candidate) !== undefined) {
			second_candidate = id; 
		}
        
		$('#whovswho .check').css('display', 'none');
        
		//display them in their respective boxes
		$('#whovswho #fighter .name').html(this.candidates[first_candidate].name);
		$('#whovswho #fighter').css('background-image', 'url(http://media.thewhosearch.com/images/versus/' + this.candidates[first_candidate].id + '.jpg)');
		$('#whovswho #fighter input').val(this.candidates[first_candidate].id);
		$('#whovswho #fighter .percentage').html(this.candidates[first_candidate].wins + ' <small>wins</small>');
        
		$('#whovswho #challenger .name').html(this.candidates[second_candidate].name);
		$('#whovswho #challenger').css('background-image', 'url(http://media.thewhosearch.com/images/versus/' + this.candidates[second_candidate].id + '.jpg)');
		$('#whovswho #challenger input').val(this.candidates[second_candidate].id);
		$('#whovswho #challenger .percentage').html(this.candidates[second_candidate].wins + ' <small>wins</small>');
		
		$('#whovswho').animate({ opacity: 1 }, 1000)	
	}
}
versus = new Versus();

var GoodFit = function () {
	this.current_phrase = 0;
	this.phrases = [
		"Visionary",
		"Inspirational",
		"Driven",
		"Motivating",
		"Curious",
		"Experienced",
		"Communicator"
	];
	
	this.switcher = function () {
		this.current_phrase = (this.current_phrase >= (this.phrases.length - 1)  ? 0 : (this.current_phrase + 1))
		
		$('#goodfit a#goodfit_slider').animate({ opacity: 0 }, function () { $(this).html(goodfit.phrases[goodfit.current_phrase]); $(this).animate({ opacity: 1 }); });
		
		setTimeout('goodfit.switcher()',2000);
	}
	
	this.load = function () {
		this.switcher();
	}	
};

goodfit = new GoodFit();




function switchBg () {
	//switch the background images in the "O" in the WHO header.
	$('#O').css('background-image', 'url(images/versus/' + o_index + '.jpg)');
	
	//increment or reset
	o_index = o_index > 23 ? 1 : o_index + 1;
}

function rand ( n ) {
  return ( Math.floor ( Math.random ( ) * n ) ) + 1;
}

$(function(){
	$("#tweets").tweet({
		count: 2,
  		query: "roderick jensen + -rory jensen",
  		loading_text: "Searching twitter...",
		refresh_interval: 5
	});
	$('#twitter').append('<a class="addtweet" href="http://search.twitter.com/search?q=brandcenter%20%2B%20-brandcenter.org&lang=all">+</a>')
	$('#twitter').append('<a class="viewmore" target="_blank" href="http://twitter.com/share?url=http%3A%2F%2Fwww.thewhosearch.com">Share</a>');
	
	versus.load();
	board.load();
	richmond.load();
	goodfit.load();
	
	$('#mikehughes_video').live('click', function (e) {
		e.preventDefault();
		$('#mikehughes_video_container').css({ display: 'block' }).animate({ opacity: 1 }, 200);
	});
	$('#mikehughes_video_close').live('click', function (e) {
		e.preventDefault();
		$('#mikehughes_video_container').animate({ opacity: 0 }, 200, function () { $(this).css({ display: 'none' }) });
	});
	
	$('.youtube').ytchromeless();
	
	$('#rickboyko_video').live('click', function (e) {
		e.preventDefault();
		$('#rickboyko_video_container').css({ display: 'block' }).animate({ opacity: 1 }, 200);
	});
	$('#rickboyko_video_close').live('click', function (e) {
		e.preventDefault();
		boyko_close();
	});
	
	$('#mikehughes_video_container .background').live('click', function (e) {
		e.preventDefault();
		$(this).find('.playing').click();
		hughes_close();
	});
	$('#rickboyko_video_container .background').live('click', function (e) {
		e.preventDefault();
		$(this).find('.playing').click();
		boyko_close();
	});
	
	var hughes_close = function () {
		$('#mikehughes_video_container').animate({ opacity: 0 }, 200, function () { $(this).css({ display: 'none' }) });
	};
	var boyko_close = function () {
		$('#rickboyko_video_container').animate({ opacity: 0 }, 200, function () { $(this).css({ display: 'none' }) });
	};
	
	
	$('#recommend_form input:text, #recommend_form textarea').live('focus', function (e) {
		if ($(this).val() == $(this).attr('rel')) {
			$(this).val('');
			$(this).select();
		}
	});

   	$('#recommend_form input:text, #recommend_form textarea').live('blur', function (e) {
   		if ($(this).val() == '') {
   			$(this).val($(this).attr('rel'));
   		}
   	});
	
	start = new Date(1996,0,1);
	now = new Date();
	
	$('#days_open').html(daysSince(start, now));
	
	wait_start = new Date(2011,02,11);
	$('#searchDay').html(searchDay(wait_start, now));
	
	rory_days_account_management = new Date(2008,05,30);
	$('#rory_days_account_management').html(searchDay(rory_days_account_management, now));

	birth_date = new Date(1985,10,19);
	$('#rory_days_alive').html(searchDay(birth_date, now));	
	if ($('#messagereceived')) {
		setTimeout(function () {
			$('#messagereceived').fadeOut();
		},4000);
	}
});

function daysSince(startDate, endDate)
{	
	var today = new Date();
	var first = new Date(today.getFullYear(), 0, 1);
	var theDay = Math.round(((today - first) / 1000 / 60 / 60 / 24) + .5, 0);
	
	return 5239 + theDay
}

function searchDay(startDate, endDate)
{	
	var one_day=1000*60*60*24;
	diff = endDate-startDate;
	diffDays = diff/one_day;
	var theDay = Math.round(((endDate - startDate) / 1000 / 60 / 60 / 24) + .5, 0);
	
	return theDay
}