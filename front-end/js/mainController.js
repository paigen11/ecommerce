var ecommerceApp = angular.module('eCommerceApp', ['ngRoute', 'ngCookies']);
ecommerceApp.controller('mainController', function($scope, $http, $location, $cookies){
	
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
				$location.path('/options');
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