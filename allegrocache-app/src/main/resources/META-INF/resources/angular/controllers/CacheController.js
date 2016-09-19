app.controller('CacheController', function($scope, $http, $location, $window, $stomp) {

	var searchObject = $location.search();
	$scope.id = searchObject.id;
	$scope.auctionId = searchObject.auctionId;
	$scope.userId = searchObject.userId;

	console.log("fetching cache entries from Allegro, auction:" + $scope.id);

	var fetchData = function() {
		var response = $http.get('/auctions/' + $scope.id); // REST call!
		response.success(function(data) {
			$scope.caches = data;
			console.log("data fetched!");
		});
		response.error(function(data) {
			var errorMsg = "failed to fetch cache entries for this id!";
			$scope.errorMsg = errorMsg;
			console.log(errorMsg);
		});		
	}
	fetchData();

	// WEB_SOCKET - begin
	$scope.cacheMsg = "";
	$stomp.connect('/cache')

    // frame = CONNECTED headers
    .then(function (frame) {
      var subscription = $stomp.subscribe('/topic/cacheOutdated', function (payload, headers, res) {
        console.log("ANGULAR VIEW RECEIVED WEBSOCKET MSG!");
        console.log(payload);
        // Is this message for me?
        if (payload.username == $scope.userId
        		&& payload.auctionId == $scope.auctionId) {
            fetchData();
            $scope.cacheMsg = payload.msg;        	
        }
      }
      )

    })
	// WEB_SOCKET - end
	
	// This is to manually request navigation to particular URL.
	// refresh == false ? navigate : (set_window_location & do_not_navigate);
	$scope.navigateTo = function(url, refresh) {

		console.log("refreshing view!");

		if (refresh || $scope.$$phase) {
			$window.location.href = url;
		} else {
			$location.path(url);
			$scope.$apply();
		}
	};
	
	$scope.deleteEntry = function(cache) {
		
		console.log("deleting cache entry...");
		console.log("cache id = " + cache.cacheId);

		var response = $http.delete('/caches/' + cache.cacheId);
		
		// Delete to yield set of remaining cache items.
		response.success(function(data) {
			$scope.caches = data;
			console.log("entry deleted!");
		});
		response.error(function(data) {
		    var errorMsg = "failed to delete the entry!";
			$scope.errorMsg = errorMsg;
			console.log(errorMsg);
		});
	};
});
