var appName = angular.module('appName', ['ngRoute', 'ngClipboard'])
appName.config(function($routeProvider, $locationProvider) {
    $routeProvider

    // route for the home page
    .when('/', {
        templateUrl: 'assets/home.html',
        controller: 'homeCtrl'
    })


    .when('/:id', {
        templateUrl: 'assets/link.html',
        controller: 'linkCtrl'
    });

    $locationProvider.html5Mode(true);

});

appName.config(['ngClipProvider',
    function(ngClipProvider) {
        ngClipProvider.setPath('//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf');
    }
]);



appName.controller('linkCtrl', function($scope, $routeParams, $http, $window) {



    $http.get('/links?shortUrl=' + $routeParams.id).then(function(response) {
        console.log(response)
        if (response.data.length === 0) {
            $scope.message = 'Not a valid link';
        } else {
            for (var i = response.data[0].links.length - 1; i >= 0; i--) {
                $window.open(response.data[0].links[i], '_blank');
            };
            $scope.links = response;
            $scope.message = 'Links not opening?';
            $scope.messageBody = 'Disable your popup browser or click here.'
        }
    }, function(response) {
        $scope.message = 'Not Valid Link';
    });

    $scope.manualLinkOpen = function() {
        if ($scope.links.data.length !== 0) {
            for (var i = $scope.links.data[0].links.length - 1; i >= 0; i--) {
                $window.open($scope.links.data[0].links[i], '_blank');
            };
        }
    }


});

appName.controller('homeCtrl', function($scope, $window, $http) {
    $scope.links = {}
    $scope.linkShow = true;

    console.log($scope.errorMsg)
    $scope.createLinks = function() {
        $scope.links = $scope.user.links.split(',');
        console.log($scope.links);


        for (var i = $scope.links.length - 1; i >= 0; i--) {
            if (!$scope.links[i].match(/^[a-zA-Z]+:\/\//))
                $scope.links[i] = 'http://' + $scope.links[i]
            $scope.links[i] = $scope.links[i].replace(/\s+/g, '');








        };
        var foo = require('shortid');

        $http.post('/links', {
            links: $scope.links,
            shortUrl: foo.generate()
        }).success(function(success) {
            $scope.url = success.shortUrl
            $scope.shortLink = 'http://bund.li/#/' + success.shortUrl;
            $scope.linkShow = false;
            $scope.errorMsg = '';
            console.log($scope.linkShow)

        }).error(function(err) {
            // Alert if there's an error
            console.log(err)
            $scope.errorMsg = err.errors.message
        });



    };
});