#What is it?
---
An ecommerce flower delivery site built in Node.js, Express, MongoDB, Mongoose and AngularJS: the full MEAN stack. The front end is entirely Angular.JS, HTML5 and CSS3 (styled using SASS). The back end is a custom API driven by Express.io and MongoDB (accessed through Mongoose) in Node.js, with integration of bCrypt and rand-token for password protection and the Stripe payment API for payment processing. 

##Live demo
---
[Live demo](tbd)

##Languages Used
---
  * HTML5
  * CSS3 (and SASS)
  * Bootstrap
  * JavaScript
  * AngularJS
  * Node.js
  * Express
  * MongoDB
  * Mongoose
  * Stripe API

##Link to Github
---
[Github](https://github.com/paigen11/ecommerce)

##Authors
---
Paige Niedringhaus

##Screenshots
---
Start screen when customers come to the site for the first time
![alt text](https://github.com/paigen11/ecommerce/blob/master/screenshots/home-page.png 'home-page.png')

New customer register screen
![alt text](https://github.com/paigen11/ecommerce/blob/master/screenshots/register-page.png 'register-page.png')

Returning customer login screen
![alt text](https://github.com/paigen11/ecommerce/blob/master/screenshots/login-page.png 'login-page.png')

Flower options selection page
![alt text](https://github.com/paigen11/ecommerce/blob/master/screenshots/options-page.png 'options-page.png')

Delivery options page
![alt text](https://github.com/paigen11/ecommerce/blob/master/screenshots/delivery-page.png 'delivery-page.png')

Order review and payment page
![alt text](https://github.com/paigen11/ecommerce/blob/master/screenshots/payment-page.png 'payment-page.png')

Stripe API payment modal
![alte text](https://github.com/paigen11/ecommerce/blob/master/screenshots/stripe-modal.png 'stripe-modal.png')

Payment receipt page after payment's approved
![alt text](https://github.com/paigen11/ecommerce/blob/master/screenshots/receipt-page.png 'receipt-page.png')

##Further Info
---
On the front end, the site is built using one AngularJS controller that controls all the routes and views for everything. The site is set up on the Twitter Bootstrap framework, then custom styled using SASS through Compass. Each view (page) has its own separate SCSS view that's compiled into the main SASS file. 

For the back end, a Node index.js file handles all of the requirements: Express, MongoDB, Mongoose, bCrypt, rand-token and Stripe. This takes all the information passed from the front end and makes it accessible to the back end. So things like customer information is safely and securely stored for later use in the MongoDB database. By employing bCrypt and rand-token, customer passwords and identities are more thoroughly protected from possible hacking. And the Stripe payment API ensures that when customers enter their payment info, Stripe handles all of those details and the ecommerce site never actually deals with that sensitive information.

So, when customers come to the site they can register / login, order weekly or monthly deliveries of flowers, enter their delivery information and pay securely through the Stripe API. They can also logout at any time, or leave the site without logging out and when they return they'll be logged back in through the use of local cookies. Little customized messages along the way, help the customer know their actions are received and successfully processed, until they get to the end of the process and their orders are complete.

There were many obstacles encountered during this project. Getting the front and back end to pass information between them was a daunting task, and then integrating the Stripe API successfully was not the easiest thing either. Ensuring information was passed from where the customer entered it involved a lot of trial and error and console logging on both sides to see what came back, and then readjusting and trying again. 

As for the Stripe API, while it should have been able to use the same code from the object displaying the total to charge the customer, the API wasn't having it and kept giving a 'payment failed' message. The solution came in the form of storing the total amount to pay as a cookie on the computer as well, thus the function was able to grab the cookie and successfully send it back to Stripe for payment processing.

##Requirements
---
There's a ton of requirements for this - apologies in advance.

For the front end of the site, Twitter's [Bootstrap](http://getbootstrap.com/getting-started/) framework was used in conjunction with [AngularJS](https://angularjs.org/), and the Angular modules of [ngCookies and ngRoutes](https://code.angularjs.org/1.5.8/). Since Bootstrap's JavaScript files were employed for site responsiveness, Google's [jQuery](https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js) script is also needed. Styling was done with SASS through [Compass](http://compass.kkbox.com/). This is optional, but it makes the styling process quicker.

To set this up on the back end of the site, [Node.js](https://docs.npmjs.com/getting-started/installing-node), [expressjs](http://expressjs.com/), [Mongoose](http://mongoosejs.com/), [bCrypt](https://www.npmjs.com/package/bcrypt), [rand-token](https://www.npmjs.com/package/rand-token) and [Stripe](https://stripe.com/docs/libraries) need to be downloaded with --save behind their install commands to save them to the package.json dependencies. 

In addition to all these downloads, you'll need to create an account with Stripe to get custom access keys for the payment processing. Once the account's created, go to Account, then click on API keys to get the codes.

##Code Examples
---
AngularJS JavaScript that takes customer registration information and passed it through to the back end. It also displays messages if the username is already taken, and if the customer successfully registers it passes them along to the flower option page.

```javascript
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
```


Function within the AngularJS front end controller that checks a user's cookies to see if they have a token for the site (meaning they've visited before). If the token exists but there's something wrong, customers are routed to the login page, or if they don't have a token stored in their cookies, the only pages they can access are the home page, the login page or the register page. All other pages are behind a gate requiring the token (which is checked again when each page view changes). 

```javascript
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
					if(($location.path() == '/') || ($location.path() == '/register') || (location.path == '/login')){
						$location.path('/options');
						}
					}	
				}), function errorCallback(response){

			};
		}else if(($location.path() != '/') && ($location.path() != '/register') && ($location.path() != '/login') && ($cookies.get('token') == undefined)){
			$location.path('/login');
		};
	};			
```


Back end NodeJS JavaScript updating the customer's account with their flower delivery information entered on the front end of the site.

```javascript
router.post('/delivery', function(req, res, next){
	Account.update({username: req.body.username},{
		fullName: req.body.fullName,
		address1: req.body.address1,
		address2: req.body.address2,
		city: req.body.city,
		state: req.body.state,
		zipCode: req.body.zipCode
		}
	).exec();
		res.json({
		post: 'addressAdded'
	});
});
```	

##Additional Improvements
---
  * A customizable flower option where customers can select different delivery frequencies, specific flower types, etc.
  * A shopping cart so customers can make multiple orders at one time, if desired
  * An account profile view (with past orders displayed)
  * Sending customers an order confirmation email once the order's been placed
