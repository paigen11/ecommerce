var ecommerceApp = angular.module('eCommerceApp', ['ngRoute', 'ngCookies']);
ecommerceApp.controller('mainController', function($scope, $rootScope, $http, $timeout, $location, $cookies){
	
	var apiPath = 'http://localhost:3000';
	// checkToken();

	$scope.register = function(){
		console.log($scope.username);
		//post request sending these 4 variables to the database
		$http.post(apiPath + '/register', {
			username: $scope.username,
			password: $scope.password,
			password2: $scope.password2,
			email: $scope.email
		}).then(function successCallback(response){
			// console.log(response.data);
			if(response.data.name == 'nameTaken'){
				$scope.nameTaken = true;
			}
			if(response.data.message == 'added'){
				$scope.welcome = true;
				$rootScope.hi = true;
				$rootScope.hi.username = $scope.username;
				$cookies.put('token', response.data.token);
				$cookies.put('username', $scope.username);
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
			if(response.data.success == 'userFound'){
				$scope.welcome = true;
				$rootScope.hi = true;
				$rootScope.username = response.data.username;
				$cookies.put('token', response.data.token); //will be used for validation
				$cookies.put('username', $scope.username);
				$timeout(function(){
					$location.path('/options');
				}, 2500);
			}else{
				$scope.notFound = true;
			}
		}, function errorCallback(response){
			console.log(response);
		})
	};

	$scope.logout = function(){
		username: $scope.username,
		$cookies.remove('token');
		$rootScope.hi = false;
		console.log('token');
	}

	$scope.flowersWeekly = function(){
		$http.post(apiPath + '/options', {
			token: $cookies.get('token'),
			frequency: 'weekly',
			total: '$140'
		}).then(function successCallback(response){
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

	$scope.address = function(){
		$http.post(apiPath + '/delivery', {
			username: $scope.username,
			fullName: $scope.fullName,
			address1: $scope.address1,
			address2: $scope.address2,
			city: $scope.city,
			state: $scope.state,
			zipCode: $scope.zipCode
		}).then(function successCallback(response){
			console.log(response.data.post);
			if(response.data.post = 'addressAdded'){
				$scope.addressAdded = true;
				$timeout(function(){
				$location.path('/payment');
				}, 3000);
			}
		}, function errorCallback(response){
			console.log(response);
		})	
	};

	$scope.$watch(function(){
		return $location.path();
	}, function(newPath){
		if(newPath == '/payment'){
			console.log('hello');
			$http.get(apiPath + '/payment', {}).then(function successCallback(response){
				$scope.fullname = response.data.fullName;
				console.log(response.data.fullName);
				console.log(response);
			}), function errorCallback(response){

			};
		}
	})


	// // function checkToken(){
	// 	// if($cookies.get('token') != null) {
	// 		$http.get(apiPath + '/getUserData?token=' + $cookies.get('token'))
	// 		.then(function successCallback(response){
	// 			// console.log(response.data.failure);
	// 			//response.data.xxxx = whatever res.json was in express
	// 			if(response.data.failure == 'badToken'){
	// 				$location.path = '/login' //goodbye, go log in again. token is expired or fake
	// 			}else if(response.data.failure == 'noToken'){
	// 				$location.path = '/login' //no token. goodbye - log in again
	// 			// }else if(response.data.failure == 'expiredToken'){
	// 			// 	$location.path = '/login' //expired token. log in again
	// 			}else{
	// 				//the token is good. Response.data will have their stuff in it
	// 				$scope.username = response.data.username;
	// 				$rootScope.hi = true;
	// 				//send them to an account page or somewhere
	// 				}	
	// 			}), function errorCallback(response){

	// 		};
	// 	// };
	// // };			

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
	})
	.when('/payment', {
		templateUrl: 'views/payment.html',
		controller: 'mainController'
	})
	.otherwise({
		redirectTo: '/'
	})
});