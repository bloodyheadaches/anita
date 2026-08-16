var pageStarted = false;
var conversation1 = new Audio('conversation1/conversation1.wav');

$(document).one('click keydown touchstart', function () {
	if (pageStarted) return;
	pageStarted = true;
	conversation1.play().catch(function (err) {
		console.warn('conversation1 did not play:', err);
	});
	$("#codeInner").typewriter();
	$("#startScreen").fadeOut(500, function () {
		$(this).remove();
	});
});

$(function () {
	$loveHeart = $("#loveHeart");
	$garden = $("#garden");
	gardenCanvas = $garden[0];
	gardenCanvas.width = $("#loveHeart").width();
	gardenCanvas.height = $("#loveHeart").height();
	gardenCtx = gardenCanvas.getContext("2d");
	gardenCtx.globalCompositeOperation = "lighter";
	garden = new Garden(gardenCtx, gardenCanvas);
	setInterval(function () { garden.render(); }, 60);
});

function startHeartAnimation() {
	if (garden) garden.initHeart();
}

(function($) {
	$.fn.typewriter = function() {
		this.each(function() {
			var $ele = $(this), str = $ele.html(), progress = 0;
			$ele.html('<span id="typing"></span><span id="cursor">|</span>');
			var $typing = $("#typing");
			var timer = setInterval(function() {
				var current = str.substr(progress, 1);
				if (current == '<') {
					progress = str.indexOf('>', progress) + 1;
				} else {
					progress++;
				}
				$typing.html(str.substring(0, progress));
				if (progress >= str.length) {
					clearInterval(timer);
					var $p = $('#pusheen');
					if ($p.length) {
						$('#pusheenWrap').css('visibility', 'visible');
						$p[0].style.opacity = 1;
						setTimeout(function() {
							$('#clickHint').show().typewriterSimple('Click me!', 80);
						}, 1800);
					}
				}
			}, 75);
		});
		return this;
	};
})(jQuery);

$.fn.typewriterSimple = function(text, speed) {
	var $el = $(this);
	$el.html('');
	var i = 0;
	var t = setInterval(function() {
		$el.html($el.html() + text[i]);
		i++;
		if (i >= text.length) clearInterval(t);
	}, speed || 80);
	return this;
};

function typewriterBig(html, speed, onDone) {
	var progress = 0;
	var $out = $('#winTyping');
	var t = setInterval(function() {
		var ch = html.substr(progress, 1);
		if (ch === '<') {
			progress = html.indexOf('>', progress) + 1;
		} else {
			progress++;
		}
		$out.html(html.substring(0, progress));
		if (progress >= html.length) {
			clearInterval(t);
			$('#winCursor').fadeOut(500);
			if (typeof onDone === 'function') onDone();
		}
	}, speed || 70);
}

var winStages = [
	{
		html: '<span class="win-comment">// me atrapaste..</span><br/>' +
		      '<span class="win-comment">// quería que me atrapes muejejej.</span><br/><br/>' +
		      'Quiero estar a tu lado cada dia de mi vida, Ani.<br/>' +
		      '¿Puedo acompañarte? <span class="opt opt-s">(S)i</span>/<span class="opt opt-n">(N)o</span>',
		yesKeys: [83],
		hasNo: true
	},
	{
		html: '¿Siempre? ¿Cada día? <span class="opt opt-s">(S)i</span>/<span class="opt opt-n">(N)o</span>',
		yesKeys: [83],
		hasNo: true
	},
	{
		html: '¿Hasta que la muerte nos separe? muejejej <span class="opt opt-s">(S)i</span>/<span class="opt opt-n">(N)o</span>',
		yesKeys: [83],
		hasNo: true
	},
	{
		html: 'hoy.. 17.08..<br/>' +
		      '¿Nos declarás.. Novia y Novio?<br/>' +
		      '<span class="win-comment">//sentite segura de votar "NO" si no estas lista.</span><br/>' +
		      '<span class="opt opt-s">(S)SISISISI</span>/<span class="opt opt-y">(Y)YESYESYES</span>',
		yesKeys: [83, 89],
		hasNo: false
	}
];

var winStageIndex = 0;
var winWaitingForAnswer = false;

function playWinStage() {
	winWaitingForAnswer = false;
	$('#winInner').html('<span id="winTyping"></span><span id="winCursor">|</span>');
	var stage = winStages[winStageIndex];
	typewriterBig(stage.html, 70, function () {
		winWaitingForAnswer = true;
	});
}

function winAnsweredNo() {
	if (!winWaitingForAnswer) return;
	var stage = winStages[winStageIndex];
	if (!stage.hasNo) return;
	var snd = new Audio('sound.wav');
	var playResult = snd.play();
	if (playResult && playResult.catch) {
		playResult.catch(function (err) {
			console.warn('sound.wav did not play:', err.name, err.message);
		});
	}
	$('#winInner .opt-n').addClass('opt-clicked');
}

function winAnsweredYes() {
	if (!winWaitingForAnswer) return;
	winWaitingForAnswer = false;
	winStageIndex++;
	$('#winInner').fadeOut(300, function () {
		$(this).show();
		if (winStageIndex < winStages.length) {
			playWinStage();
		} else {
			$(this).html('');
			showCertificatePusheen();
		}
	});
}

$(document).keydown(function (e) {
	if (!winWaitingForAnswer) return;
	var key = e.which || e.keyCode;
	var stage = winStages[winStageIndex];
	if (key === 78) {
		winAnsweredNo();
	} else if (stage.yesKeys.indexOf(key) !== -1) {
		winAnsweredYes();
	}
});

$(document).delegate('.opt-n', 'click', function () { winAnsweredNo(); });
$(document).delegate('.opt-s, .opt-y', 'click', function () { winAnsweredYes(); });

function showCertificatePusheen() {
	setTimeout(function () {
		var $p = $('#winPusheen');
		$p[0].style.opacity = 1;
		setTimeout(function () {
			$('#winClickHint').show().typewriterSimple('click me!', 80);
		}, 1800);
	}, 800);
}

$(function () {
	$('#winPusheen').bind('click', function () {
		$('#certOverlay').css('display', 'flex').hide().fadeIn(300);
	});
	$('#certOverlay').bind('click', function () {
		$(this).fadeOut(300);
	});
});

var gameRunning = false;
var catchProg   = 0;
var playerVel   = 0;
var bgOffset    = 0;
var gameInterval = null;
var bounceT     = 0;

function startGame() {
	$('#clickHint').fadeOut(200);
	$('#pusheen').unbind('click').css('cursor', 'default');
	$('#loveHeart').fadeOut(600, function() {
		$('#gameScreen').css('display', 'flex').hide().fadeIn(500);
		catchProg = 0;
		playerVel = 0;
		bgOffset  = 0;
		gameRunning = true;
		$('#catchBar').css('width', '0%');
		gameInterval = setInterval(gameStep, 16);
	});
}

var playerFacing = 1;
var playerFlipTimer = 0;

function gameStep() {
	bounceT += 0.05;
	playerVel *= 0.88;
	catchProg -= 0.0040;
	catchProg += playerVel * 0.009;
	catchProg = Math.max(0, Math.min(1, catchProg));
	$('#catchBar').css('width', (catchProg * 100) + '%');
	bgOffset = (bgOffset + playerVel * 4) % 120;
	$('#streetBg').css('transform', 'translateX(-' + bgOffset + 'px)');
	$('#pusheenGame').css('bottom', (40 + Math.sin(bounceT) * 6) + 'px');
	$('#playerChar').css('bottom', (40 + Math.abs(Math.sin(bounceT * 1.8)) * (playerVel > 0.2 ? 8 : 3)) + 'px');
	if (catchProg >= 1) winGame();
	if (playerVel > 0.1) {
		playerFlipTimer += playerVel * 0.15;
		if (playerFlipTimer >= 1) {
			playerFlipTimer = 0;
			playerFacing *= -1;
			$('#playerImg').css('transform', 'scaleX(' + playerFacing + ')');
		}
	}
}

$(document).keydown(function(e) {
	if (!gameRunning) return;
	var key = e.which || e.keyCode;
	if (key === 65 || key === 68) {
		playerVel = Math.min(playerVel + 0.45, 6);
	}
});

function winGame() {
	gameRunning = false;
	clearInterval(gameInterval);
	$('#catchBar').css('width', '100%');
	setTimeout(function() {
		$('#gameScreen').fadeOut(800, function() {
			winStageIndex = 0;
			$('#winInner').html('');
			$('#winScreen').css('display', 'flex').hide().fadeIn(1000, function() {
				setTimeout(function() { playWinStage(); }, 400);
			});
		});
	}, 400);
}
