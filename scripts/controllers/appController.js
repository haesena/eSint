/**
 * Created by haesen on 14.10.2016.
 */

angular
    .module("eSint")
    .controller("appController", ["$scope", "$rootScope", "$state", "Auth", "$firebaseArray", "$firebaseObject", '$mdSidenav', "menu",
        function($scope, $rootScope, $state, Auth, $firebaseArray, $firebaseObject, $mdSidenav, menu) {
            $scope.auth = Auth;

            $rootScope.loadData = function(uid) {
                var userRef = firebase.database().ref().child("users").child(uid);
                $firebaseObject(userRef)
                    .$loaded()
                    .then(function(user){
                        $scope.user = user;
                        $scope.groups = {};
                        for(var gid in user.groups) {
                            $firebaseObject(firebase.database().ref().child("groups").child(gid))
                                .$loaded()
                                .then(function(group){
                                    $scope.groups[group.$id]  = group;
                                });
                        }
                });
            }

            $scope.logOut = function() {
                // log out the user
                $scope.auth.$signOut();
                // and redirect to the homepage
                $state.go("home");
            };

            // any time auth state changes, add the user data to scope
            $scope.auth.$onAuthStateChanged(function(firebaseUser) {
                $rootScope.firebaseUser = firebaseUser;

                if(firebaseUser) {

                    var uRef = firebase.database().ref().child("users").child(firebaseUser.uid);
                    uRef.child("name").set(firebaseUser.displayName);
                    uRef.child("photo").set(firebaseUser.photoURL);
                    uRef.child("lastLogin").set(new Date().toTimeString());

                    $rootScope.loadData(firebaseUser.uid);
                }
            });

            // Functions for menu
            var vm = this;

            //functions for menu-link and menu-toggle
            vm.isOpen = isOpen;
            vm.toggleOpen = toggleOpen;
            vm.autoFocusContent = false;
            vm.menu = menu;

            vm.status = {
                isFirstOpen: true,
                isFirstDisabled: false
            };

            function isOpen(section) {
                return menu.isSectionSelected(section);
            }

            function toggleOpen(section) {
                menu.toggleSelectSection(section);
            }

            $scope.vm = vm;

            $scope.pages = [
                {
                    name: 'New Group',
                    state: 'groups({action: "create"})',
                    type: 'link',
                    icon: 'fa fa-plus'
                },{
                    name: 'Manage Groups',
                    state: 'groups({action: "manage"})',
                    type: 'link',
                    icon: 'fa fa-cog'
                }
            ];

            // Function for sidebar toggling
            $scope.$mdSidenav = $mdSidenav;

            $scope.toggleSideNav = function() {
                $mdSidenav('left').toggle();
            };
        }
    ]);