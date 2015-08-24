var Level = function(num) {
	var mod = {};


	var scoreText;
	var codeText;
	var total = 0;

	mod.num = num;
	mod.score = 0;
	mod.failed = false;
	mod.complete = false;

	function imgToData(url, callback) {
		var canvas, ctx, img;
		
		canvas = document.createElement("canvas");

		img = new Image();
		img.src = url;
		
		img.addEventListener("load", function() {
			canvas.width = img.width;
			canvas.height = img.height;

			ctx = canvas.getContext("2d");

			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			callback(ctx.getImageData(0, 0, canvas.width, canvas.height), img.width, img.height);
		});
	}

	function drawTile(x, y) {
		var tile = new game.Sprite();
		tile.image = "mainSprites_0";
		tile.still = true;
		tile.x = x*32;
		tile.y = y*32;
		tile.order.back();
	}

	function componentToHex(c) {
    	var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b) {
	    return componentToHex(r) + componentToHex(g) + componentToHex(b);
	}

	mod.checkComplete = function() {
		if (total == mod.score) {
			mod.complete = true;
		} else {
			mod.complete = false;
		}
	}

	mod.generate = function() {
		// destroy old collisions
		wallCollision.boxes = [];
		holeCollision.boxes = [];
		goalCollision.boxes = [];

		// draw level from png
		imgToData("res/level/level_"+num+".png", function(map, width, height) {
			for (var i = 0; i < map.data.length; i += 4) {
				var index = i / 4;
				var y = Math.floor(index / width);
				var x = index - y * width;

				var id = rgbToHex(map.data[i], map.data[i+1], map.data[i+2])

				switch(id) {
					// dinosaur
					case "00ff00":
						drawTile(x, y);
						dinosaur = Dinosaur();
						camera = Camera();
						camera.following = dinosaur;
						dinosaur.sprite.x = camera.sprite.x = x*32;
						dinosaur.sprite.y = camera.sprite.y = y*32;
						break;
					// hole
					case "000000":
						Hole(x*32, y*32).sprite.order.back();
						break;
					// wall facing
					case "ff0000":
						Wall(x*32, y*32, 1).sprite.order.back();
						break;
					case "ee0000":
						Wall(x*32, y*32, 2).sprite.order.back();
						break;
					// human
					case "ffff00":
						total++;
						drawTile(x, y);
						Human(x*32, y*32);
						break;
					case "ff00ff":
						Goal(x*32, y*32).sprite.order.back();
						break;
					// floor tile
					default:
						drawTile(x, y);
						break;
				}
			}

			dinosaur.sprite.order.front();

			input.fnc = function(e) {
				dinosaur.controller(e);
			};

			scoreText = Text("saved "+mod.score+"/"+total);
			codeText = Text("code "+levelCode(mod.num));

			game.set.method(function() {
				// keys
				input.run();

				// update entities
				entities.update();

				// camera
				xOffset = Math.round(-camera.sprite.x+gameWidth/2-16);
				yOffset = Math.round(-camera.sprite.y+gameHeight/2-16)
				game.set.offset(xOffset, yOffset);

				scoreText.updateText("saved "+mod.score+"/"+total);
				scoreText.updateXY(-xOffset+8, -yOffset+8);
				codeText.updateXY(-xOffset+220, -yOffset+8);

			});

		});

	}

	mod.destroy = function() {
		dinosaur.destroy();
		camera.destroy();
		entities.destroy();
		mod = {};
	};


	return mod;
}