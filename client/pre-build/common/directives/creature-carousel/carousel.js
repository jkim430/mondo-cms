app.directive('creatureCarousel', function(UserFactory, CreatureFactory, ShapeFactory, $state) {

    return {
        restrict: 'E',
        scope: {
            fcn: "=",
            height: '=',
            width: '=',
            slides: '=',
            file: '=',
            showLevel: '='
        },
        link: function(scope, elem, attr) {
            scope.isAdmin = UserFactory.currentUser.isAdmin;
            var user = UserFactory.currentUser
            scope.creatures = [];
            for (var i = 0; i < scope.slides.length; i += 3) {
                scope.creatures.push(scope.slides.slice(i, i + 3));
            };
            if (!scope.creatures.length) {
                scope.creatures = [
                    []
                ];
                scope.add = true;
            }
            scope.creatures = scope.creatures.reverse();
            scope.myInterval = 0;
            scope.noWrapSlides = false;

            scope.removeCreature = function(creature) {
                var index;
                user.creature.forEach(function(thing, ind) {
                    if (thing._id === creature._id) index = ind;
                })
                user.creature.splice(index, 1);
                UserFactory.updateUser(user)
                    .then(function() {
                        return CreatureFactory.deleteCreature(creature.creature)
                    })
                    .then(function() {
                        return ShapeFactory.removeShape(creature.shape)
                    })
                    .then(function() {
                        $state.go('creatures.select', {}, {
                            reload: true
                        })
                    })
            }
        },
        templateUrl: "pre-build/common/directives/creature-carousel/carousel.html"
    };

})