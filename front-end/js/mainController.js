var ecommerceApp = angular.module('eCommerceApp', ['ngRoute', 'ngCookies']);
ecommerceApp.controller('mainController', function($scope, $rootScope, $http, $timeout, $location, $cookies){
	
	var apiPath = 'http://localhost:3000';

	$scope.register = function(){
		console.log($scope.username);
		//post request sending these 4 variables to the database
		$http.post(apiPath + '/register', {
			username: $scope.username,
			password: $scope.password,
			password2: $scope.password2,
			email: $scope.email
		}).then(function successCallback(response){
			console.log(response);
			if(response.data.message == 'added'){
				$scope.welcome = true;
				$rootScope.hi = true;
				$rootScope.hi.username = $scope.username;
				$timeout(function(){
					$location.path('/options');
				}, 2500);
			}
		}, function errorCallback(response){
			console.log(response);
		})
	};

	$scope.login = function(){
		$http.post(apiPath + '/login', {
			username: $scope.username,
			password: $scope.password
		}).then(function successCallback(response){
			console.log(response);
			if(response.data.success == 'userFound'){
				$scope.welcome = true;
				$rootScope.hi = true;
				$rootScope.username = response.data.username;
				console.log($rootScope.username);
				$timeout(function(){
					$location.path('/options');
				}, 2500);
			}
		}, function errorCallback(response){
			console.log(response);
		})
	};
});

	

//set up routes using routes module
ecommerceApp.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'views/main.html',
		controller: 'mainController'
	})
	.when('/login', {
		templateUrl: 'views/login.html',
		controller: 'mainController'
	})
	.when('/register',  {
		templateUrl: 'views/register.html',
		controller: 'mainController'
	}).otherwise({
		redirectTo: '/'
	})
});