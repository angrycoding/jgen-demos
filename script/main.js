krang({packages: {
	jGen: 'https://raw.github.com/angrycoding/jgen/master/src/jGen'
}}).require([
	'@jGen',
	'@jGen!map!resources/map.json',
	'@jGen!sprite!resources/dude.json'
], function(jGen, Scene, DudeSprite) {

	DudeSprite.event(jGen.Constants.ON_ROTATE, function(sprite, angle) {
		switch (jGen.Utils.rad2deg(angle)) {
			case -90: sprite.setProperty('dir', 'up'); break;
			case 90: sprite.setProperty('dir', 'down'); break;
			case 0: sprite.setProperty('dir', 'right'); break;
			case 180: sprite.setProperty('dir', 'left'); break;
			case 225: sprite.setProperty('dir', 'up-left'); break;
			case -45: sprite.setProperty('dir', 'up-right'); break;
			case 45: sprite.setProperty('dir', 'down-right'); break;
			case -225: sprite.setProperty('dir', 'down-left'); break;
		}
	});

	DudeSprite.event(jGen.Constants.ON_PROPCHANGE, function(sprite, props) {
		var frame = [props.dir];
		if (props.walking) frame.push('walking');
		frame = frame.join('-');
		sprite.setFrame(frame);
	});

	DudeSprite.event(jGen.Constants.ON_WALKSTART, function(sprite) {
		// console.info('ON_WALKSTART');
		sprite.setProperty('walking', true);
	});

	DudeSprite.event(jGen.Constants.ON_WALKSTOP, function(sprite) {
		// console.info('ON_WALKSTOP');
		sprite.setProperty('walking', false);
	});

	DudeSprite.event(jGen.Constants.ON_COLLIDE, function(sprite) {
		console.info('COLLISION');
	});





	var sprite = new DudeSprite();
	sprite.move(50, 378);
	sprite.rotate(jGen.Utils.deg2rad(0));
	sprite.show();

	var sprite2 = new DudeSprite();
	sprite2.move(878, 250);
	sprite2.rotate(jGen.Utils.deg2rad(180));
	sprite2.show();

	var sprite3 = new DudeSprite();
	sprite3.move(178, 50);
	sprite3.rotate(jGen.Utils.deg2rad(90));
	sprite3.show();

	var sprite4 = new DudeSprite();
	sprite4.move(378, 650);
	sprite4.rotate(jGen.Utils.deg2rad(90));
	sprite4.show();

	var speed = 0.4;
	var keys = {};

	var viewPort = new Scene(
		document.getElementById('map'),
		840, 640
	);

	var miniMap = new Scene(
		document.getElementById('miniMap'),
		200, 200, true
	);



	miniMap.render();


	viewPort.addSprite(
		sprite,
		sprite2, sprite3, sprite4
	);



	var fpsw = document.getElementById('fps');

	var cameraX = 0;
	var cameraY = 0;
	var cameraWidth = 300;
	var cameraHeight = 300;

	// var f = document.createElement('div');
	// f.style.position = 'absolute';
	// f.style.width = cameraWidth + 'px';
	// f.style.height = cameraHeight + 'px';

	// f.style.top = '348px';
	// f.style.opacity = '0.5';
	// f.style.border = '1px solid red';
	// document.body.appendChild(f);

	var s = null;
	var fps = 0;


	jGen.Timer(function(delta) {

		if (new Date().getSeconds() !== s) {
			fpsw.innerHTML = fps;
			s = new Date().getSeconds();
			fps = 0;
		}

		var angle = null;

		if (keys[37]) {
			if (keys[40]) angle = -225;
			else if (keys[38]) angle = 225;
			else angle = 180;
		}

		else if (keys[39]) {
			if (keys[40]) angle = 45;
			else if (keys[38]) angle = -45;
			else angle = 0;
		}

		else if (keys[38]) {
			angle = -90;
		}

		else if (keys[40]) {
			angle = 90;
		}

		if (angle !== null) {
			sprite.walk(jGen.Utils.deg2rad(angle), speed * delta);
		}

		var spritePos = sprite.position();

		cameraX = Math.max(
			spritePos[0] + sprite.width() - cameraWidth,
			Math.min(spritePos[0], cameraX)
		);

		cameraY = Math.max(
			spritePos[1] + sprite.height() - cameraHeight,
			Math.min(spritePos[1], cameraY)
		);


		var offsetLeft = cameraX + cameraWidth / 2 - (840 / 2);
		var offsetTop = cameraY + cameraHeight / 2 - (640 / 2);


		viewPort.translate(offsetLeft, offsetTop);
		viewPort.render();

		// f.style.top = (cameraY - offset[1]) + 'px';
		// f.style.left = (cameraX - offset[0]) + 'px';

		fps++;


	});

	document.addEventListener('keydown', function(event) {
		keys[event.which] = true;
	});

	document.addEventListener('keyup', function(event) {
		delete keys[event.which];
	});

});