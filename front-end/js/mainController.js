var ecommerceApp = angular.module('eCommerceApp', ['ngRoute', 'ngCookies']);
ecommerceApp.controller('mainController', function($scope, $rootScope, $http, $timeout, $location, $cookies){
	
	var apiPath = 'http://localhost:3000';
	checkToken();

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
				$cookies.put('token', response.data.token);
				// $cookies.put('username', $scope.username);
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
				console.log(response.data.token);
				$cookies.put('token', response.data.token); //will be used for validation
				// $cookies.put('username', $scope.username);
				console.log($rootScope.username);
				$timeout(function(){
					$location.path('/options');
				}, 2500);
			}
		}, function errorCallback(response){
			console.log(response);
		})
	};

	$scope.flowersWeekly = function(){
		console.log($cookies.get('token'))
		$http.post(apiPath + '/options', {
			token: $cookies.get('token'),
			frequency: 'weekly',
			total: '$140'
		}).then(function successCallback(response){
			console.log(response);
			if(response.data.post == 'optionAdded'){
				$scope.choiceMade = true;
				$timeout(function(){
					$location.path('/delivery');
				}, 1500);
			}	
		}, function errorCallback(response){
			console.log(response);
		})
	};

	$scope.flowersMonthly = function(){
		$http.post(apiPath + '/options', {
			token: $cookies.get('token'),
			frequency: 'monthly',
			total: '$50'
		}).then(function successCallback(response){
			console.log(response);
			if(response.data.post == 'optionAdded'){
				$scope.choiceMade = true;
				$timeout(function(){
					$location.path('/delivery');
				}, 1500);
			}
		}, function errorCallback(response){
			console.log(response);
		})
	}



	function checkToken(){
		if($cookies.get('token') != null) {
			$http.get(apiPath + '/getUserData?token=' + $cookies.get('token'))
			.then(function successCallback(response){
				//response.data.xxxx = whatever res.json was in express
				if(response.data.failure == 'badToken'){
					// $location.path = '/login' //goodbye, go log in again. token is expired or fake
				}else if(response.data.failure == 'noToken'){
					// $location.path = '/login' //no token. goodbye - log in again
				}else{
					//the token is good. Response.data will have their stuff in it
					$scope.username = response.data.username;
					$rootScope.hi = true;
					}	
				}), function errorCallback(response){

			};
		};
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
	})
	.when('/options', {
		templateUrl: 'views/options.html',
		controller: 'mainController'
	})
	.when('/delivery', {
		templateUrl: 'views/delivery.html',
		controller: 'mainController'
	}).otherwise({
		redirectTo: '/'
	})
});