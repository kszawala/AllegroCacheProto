var app = angular.module('app', []);

app.config([ '$locationProvider', function($locationProvider) {

	// otherwise $location does not search for query strings in URL!
	// @see
	// https://code.angularjs.org/1.2.23/docs/guide/$location#-location-service-configuration
	$locationProvider.html5Mode(true);
} ]);