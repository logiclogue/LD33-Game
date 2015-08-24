var GameOver = function() {
	Text("GAME OVER", -xOffset+104, -yOffset+64);

	dinosaur.sprite.speed = 0;

	var mod = Menu(-xOffset+120, -yOffset+128, ["retry", "main menu"], [
		function() {
			var levelnum = level.num;
			destroy();

			entities.destroy();

			level = new Level(levelnum);
			level.generate();
		},
		function() {
			destroy();

			MainMenu();
		}
	]);

	game.set.method(function() {
		// keys
		input.run();

		camera.update();

	});

	function destroy() {
		global.sprites = [];
		mod.destroy();
		mod = {};
		input.reset();
	};


	return mod;
};