var Entity = function() {
	var mod = {};


	mod.sprite = new game.Sprite();
	mod.sprite.order.front();


	return mod;
};


var Dinosaur = function() {
	var mod = Entity();


	mod.speed = 0.05;
	mod.sprite.image = "mainSprites_8";
	mod.collision = new game.CollisionBox(mod.sprite.x, mod.sprite.y, 32, 32, dinosaurCollision);


	return mod;
};


var Human = function() {
	var mod = Entity();


	mod.speed = 0.07;

	mod.sprite.image = "mainSprites_16";
	mod.sprite.x = 64;
	mod.sprite.y = 64;

	mod.sprite.order.front();

	var sensor =  new game.CollisionGroup();
	mod.collision = new game.CollisionBox(mod.sprite.x-32, mod.sprite.y-32, 64, 64, sensor);


	mod.walking = function(direction) {
		mod.sprite.speed = human.speed;
		mod.sprite.setAnimation("humanWalking", 50);
		mod.sprite.direction = direction;
	};

	mod.stopped = function() {
		mod.sprite.speed = 0;
		mod.sprite.animation.name = "";
		mod.sprite.image = "mainSprites_16";
	};


	sensor.addCollision(dinosaurCollision, {
		general: function() {
			mod.walking((Math.PI + Math.PI / 2) + Math.atan2(dinosaur.sprite.y - mod.sprite.y, dinosaur.sprite.x - mod.sprite.x));

			setTimeout(function() {
				mod.stopped();
			}, 1000);
		}
	});


	return mod;
};