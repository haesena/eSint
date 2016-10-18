/**
 * Created by haesen on 12.10.2016.
 */

angular
    .module("eSint")
    .factory("Auth", ["$firebaseAuth",
        function($firebaseAuth) {
            return $firebaseAuth();
        }
    ]);

angular
    .module("eSint")
    .factory('menu', ['$location', function ($location) {
        var self;
        return self = {
            toggleSelectSection: function (section) {
                self.openedSection = (self.openedSection === section ? null : section);
            },
            isSectionSelected: function (section) {
                return self.openedSection === section;
            },

            selectPage: function (section, page) {
                page && page.url && $location.path(page.url);
                self.currentSection = section;
                self.currentPage = page;
            }
        };

    }])

    //take all whitespace out of string
    .filter('nospace', function () {
        return function (value) {
            return (!value) ? '' : value.replace(/ /g, '');
        };
    })
    //replace uppercase to regular case
    .filter('humanizeDoc', function () {
        return function (doc) {
            if (!doc) return;
            if (doc.type === 'directive') {
                return doc.name.replace(/([A-Z])/g, function ($1) {
                    return '-' + $1.toLowerCase();
                });
            }

            return doc.label || doc.name;
        };
    });
