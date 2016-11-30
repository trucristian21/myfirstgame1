/*global Phaser*/


var game = new Phaser.Game(800, 600, Phaser.AUTO, '');
var game_state = {}


game_state.main = function() {};
game_state.main.prototype = {


    preload: function() {


        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/Pac-Man-Ghost.png');
        game.load.spritesheet('dude', 'assets/Pac-Man-7.png', 140, 140);


    },


    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.score = 0

        game.add.sprite(0, 0, 'sky');

        this.platforms = game.add.group();
        this.platforms.enableBody = true;

        var ground = this.platforms.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        var ledge = this.platforms.create(400, 432, 'ground');
        ledge.body.immovable = true;
        var ledge = this.platforms.create(100, 320, 'ground');
        ledge.body.immovable = true;
        var ledge = this.platforms.create(300, 190, 'ground');
        ledge.body.immovable = true;

        this.player = game.add.sprite(32, game.world.height - 150, 'dude');
        this.player.scale.setTo(0.5, 0.5)
        
        game.physics.arcade.enable(this.player);
        this.player.body.setSize(75,75)
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);


        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = 450;
        this.player.body.bounce.y = 0.6;

        this.stars = game.add.group();
        this.stars.enableBody = true;
        for (var i = 0; i < 12; i++) {
            var star = this.stars.create(i * 70, 0, 'star');
            star.body.gravity.y = 250;
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
            star.scale.setTo(0.5, 0.5)
            star.body.setSize(72, 72,10,10);
        }

        this.scoreText = game.add.text(16, 16, 'score: 0', {
            fontsize: '32px',
            fill: '#000'
        })


        this.cursors = game.input.keyboard.createCursorKeys();


    },

    update: function() {

        game.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.collide(this.stars, this.platforms);
        game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -150;
            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');
        }
        else {
            this.player.animations.stop();

            this.player.frame = 4;
        }


        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -350;
        }
        
        // game.debug.body(this.player)
    },
    collectStar: function(player, star) {
        star.kill();
        this.score++;
        this.scoreText.text = 'score: ' + this.score;
    }
}








game.state.add('main', game_state.main);
game.state.start('main');
