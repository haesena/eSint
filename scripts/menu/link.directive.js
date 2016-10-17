/**
 * Created by haesen on 15.10.2016.
 */
angular
    .module("eSint")
    .directive('menuLink', ["$mdSidenav", function ($mdSidenav) {
        return {
            scope: {
                section: '='
            },
            templateUrl: 'partials/link.tmpl.html',
            link: function ($scope, $element, $mdMedia) {
                var controller = $element.parent().controller();

                $scope.focusSection = function () {
                    // When link is clicked, the sidemenu has to be closed
                    $mdSidenav('left').toggle();
                    controller.autoFocusContent = true;
                };
            }
        };
    }]);