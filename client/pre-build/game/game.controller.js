app.controller('GameController', function($scope, $stateParams, WorldsFactory, CameraFactory, MapFactory, CreatureFactory, TimeFactory, $state, $q) {

    if ($('canvas')) $('canvas').remove();
    // <------ GAME ------>
    //voxel-engine: base module
    var map = MapFactory.getCurrentMap();
    window.Map = map; // Working

    var createGame = window.voxelEngine;
    var game = createGame(WorldsFactory.newWorldOptions()); //World Data from factory
    game.map = map;

    game.appendTo(document.body)
    window.game = game; //For Debugging
    WorldsFactory.setCurrentGame(game);


    // <------ CAMERA ------>
    CameraFactory.set(game);

    // <------ SKY ------>
    var createSky = window.Sky({
        game: game
    });
    var sky = createSky();

    game.on('tick', sky);

    TimeFactory.setTick(game);

    var Highlight = window.Highlight;
    var highlighter = Highlight(game);
    var positionME;
    highlighter.on('highlight', function(voxelPosArray) {
        positionME = voxelPosArray;
    });

    game.trees = WorldsFactory.getCurrentWorld().trees || undefined;
    // console.log(game.trees);
    var createTrees = window.Tree(game);
    if (!game.trees) {
        createTrees({
            bark: 3,
            leaves: 4,
            densityScale: 2,
            treeType: 'subspace',
            random: function() {
                return 1;
            }
        });
    } else {
        game.trees = JSON.parse(game.trees);
        createTrees({
            bark: 3,
            leaves: 4,
            treeType: 'subspace',
            // densityScale: 2,
            random: function() {
                return 1;
            }
        })
    }

    //calling creature constructor
    var createCreature = CreatureFactory.create(game, window.voxel, window.voxelMesh)
    var pigeon = new createCreature({
        name: 'pigeon',
        size: 10,
        vision: 3,
        isHerbivore: true
    });
    window.pigeon = pigeon;



    var clouds = window.Clouds({
        // pass a copy of the game
        game: game,

        // how high up the clouds should be from the player
        high: 10,

        // the distance from the player the clouds should repeat
        distance: 25,

        // how many clouds to generate
        many: 10,

        // how fast the clouds should move
        speed: 0.01,

        // material of the clouds
        material: new game.THREE.MeshBasicMaterial({
            emissive: 0xffffff,
            shading: game.THREE.FlatShading,
            fog: false,
            transparent: true,
            opacity: 0.5,
        }),
    });


    //render

    var start = window.start(game);

    function updateCreatureStuff(arr) {
        return $q.all(arr.map(function(creature) {
            return CreatureFactory.updateCoord(creature.position)
                .then(function() {
                    return CreatureFactory.updateCoord(creature.rotation)
                })
        }))
    }

    function postCreatureStuff(arr) {
        return $q.all(arr.map(function(creature) {
            return CreatureFactory.postCoord([creature.position, creature.rotation])
                .then(function(coords) {
                    console.log('hello', coords, creature)
                    creature.position = coords[0];
                    creature.rotation = coords[1];
                    console.log(creature)
                    return CreatureFactory.postCreature(creature); //parents will be set here
                })
        }))
    }

    $scope.save = function() {
        var existing = [],
            isNew = [];
        game.creatures.forEach(function(creature) {
            delete creature.map;
            delete creature.game;
            delete creature.item;
            if (creature._id) existing.push(creature);
            else isNew.push(creature);
        })
        updateCreatureStuff(existing)
            .then(function() {
                return postCreatureStuff(isNew)
            })
            .then(function(newCreatures) {
                var allCreatures = existing.concat(newCreatures);
                game.trees = JSON.stringify(game.trees);
                var updatedWorld = {
                    map: game.map,
                    trees: game.trees,
                    creatures: allCreatures
                };

                return WorldsFactory.updateWorld($stateParams.id, updatedWorld)
            })
            .then(function() {
                $state.go('worlds');
            })
    };



    // <------ PLAYER ------>
    // voxel-player: add player that can move around. It needs a copy of the game
    // var createPlayer = window.voxelPlayer(game);
    // var player = createPlayer(); //creates player and provide dummy texture
    // window.player = player;
    // player.pov('third');
    // player.possess(); //camera follow player
    // player.yaw.position.set(size / 2, 10, size / 2);

    // //Toggle Camera First / Third Person View
    // window.addEventListener('keydown', function(ev) {
    //   if (ev.keyCode === 'R'.charCodeAt(0)) {
    //     player.toggle();
    //   }
    // });

    // // Make Player Fly
    // var fly = window.voxelFly;
    // var makeFly = fly(game);
    // var target = game.controls.target();
    // game.flyer = makeFly(target);

});