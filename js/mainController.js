var ecommerceApp = angular.module('eCommerceApp', ['ngRoute', 'ngCookies']);
ecommerceApp.controller('mainController', function($scope, $rootScope, $http, $timeout, $location, $cookies){

	var apiPath = 'http://paigeniedringhaus.com:3000';
	checkToken();

	//registration page 
	$scope.register = function(){
		console.log($scope.username);
		//post request sending these 4 variables to the database
		$http.post(apiPath + '/register', {
			username: $scope.username,
			password: $scope.password,
			password2: $scope.password2,
			email: $scope.email
		}).then(function successCallback(response){
			console.log(response.data);
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

	//login page
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

	//logout function (no page, so no ng-href)
	$scope.logout = function(){
			$cookies.remove('token');
			$cookies.remove('username');
			$rootScope.hi = false;
			$location.path('/');
			console.log($cookies.get('token'));
			console.log($cookies.get('username'));
	};

	//if a customer selects weekly flowers option
	$scope.flowersWeekly = function(){
		$http.post(apiPath + '/options', {
			token: $cookies.get('token'),
			frequency: 'Weekly',
			total: 140.00
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

	//if a customer selects monthly flowers option
	$scope.flowersMonthly = function(){
		$http.post(apiPath + '/options', {
			token: $cookies.get('token'),
			frequency: 'Monthly',
			total: 50.00
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

	//delivery page to collect customer address
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

	//Stripe checkout API
	$scope.payOrder = function() {
        $scope.errorMessage = "";
        var handler = StripeCheckout.configure({
            key: 'pk_test_W8jeyVqgTWajOCfvSR4FaJ0k',
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: function(token) {
                console.log("The token Id is: ");
                console.log(token.id);
                console.log($cookies.get('total'));

                $http.post(apiPath + '/stripe', {
                    amount: $cookies.get('total') * 100,
                    stripeToken: token.id,
                    token: $cookies.get('token')
                        //This will pass amount, stripeToken, and token to /payment
                }).then(function successCallback(response) {
                    console.log(response.data);
                    if (response.data.success) {
                        $scope.paidFor = true;
                        $timeout(function(){
                        	$location.path('/receipt');
                    	}, 2000);
                    } else {
                        $scope.errorMessage = response.data.message;
                        //same on the checkout page
                    }
                }, function errorCallback(response) {});
            }
        })
        handler.open({
            name: 'Flowers Galore',
            description: 'Brightening the world, one bloom at a time',
            amount: $scope.userInfo.document.total * 100
        });
    };

    //edit order
    $scope.editOrder = function(){
    	$location.path('/options');
    };

    //check if user has token from previous visit on computer and log them in if they do
	function checkToken(){
		if(($cookies.get('token') != undefined)){	
			$http.get(apiPath + '/getUserData?token=' + $cookies.get('token'),{
			}).then(function successCallback(response){
				//response.data.xxxx = whatever res.json was in express
				if(response.data.failure == 'badToken'){
					console.log('badToken - this token is not in the system')
					$location.path('/login'); //goodbye, go log in again. token is expired or fake
				}else if(response.data.failure == 'noToken'){
					console.log('noToken - the user has no token, they cannot be here')
					$location.path('/login'); //no token. goodbye - log in again
				}else{
					//the token is good. Response.data will have their stuff in it
					$cookies.put('total', response.data.document.total);
					$scope.username = response.data.document.username;
					$('.navbar-text').text('Hi ' + $scope.username);
					$scope.userInfo = response.data;
					$rootScope.hi = true;
					if(($location.path() == '/') || ($location.path() == '/register') || (location.path() == '/login')){
						$location.path('/options');
						}
					}	
				}), function errorCallback(response){

			};
		}else if(($location.path() != '/') && ($location.path() != '/register') && ($location.path() != '/login') && ($cookies.get('token') == undefined)){
			$location.path('/login');
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
	})
	.when('/payment', {
		templateUrl: 'views/payment.html',
		controller: 'mainController'
	})
	.when('/receipt', {
		templateUrl: 'views/receipt.html',
		controller: 'mainController'
	})
	.otherwise({
		redirectTo: '/'
	})
});