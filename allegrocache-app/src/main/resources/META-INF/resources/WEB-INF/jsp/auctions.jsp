<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Watch List</title>
<LINK rel="stylesheet" href="css/default.css" type="text/css">
<LINK rel="stylesheet" href="css/div.css" type="text/css">
</head>
<body background="img/jsp.jpg" onload="connect();">
	<div style="background-color: white">

		<table>
			<tr>
				<td align="left"><img src="img/watchlist.jpg" /></td>
				<td align="right"><c:out
						value="Allegro login: ${userCredentials.username}" /></td>
			</tr>
		</table>

		<form:form commandName="auctionIdentifier">
			<table>
				<tr>
					<!-- SECRET: max is set to Long.MAX_VALUE -->
					<td><form:input type="number" min="0"
							max="9223372036854775807" path="auctionId" required="true" /></td>
					<td><input type="submit" value="Add auction by ID" /></td>
				</tr>
			</table>
		</form:form>
		

		<table>
			<tr>
				<td>Auction Id</td>
				<td>Name</td>
				<td>Cached Count</td>
				<td></td>
				<td></td>
			</tr>

			<c:forEach var="a" items="${auctions}">
				<tr>
					<td><a href="${allegroHome}/show_item.php?item=${a.auctionId}"><c:out
								value="${a.auctionId}" /></a></td>
					<td><c:out value="${a.name}" /></td>
					<td align="center"><a
						href="${pageContext.request.contextPath}/caches.html?id=${a.id}&auctionId=${a.auctionId}&userId=${a.username}"><p
								style="color: green;" id="cacheCount${a.auctionId}">
								<c:out value="${fn:length(a.contents)}" />
							</p></a></td>
					<td><form
							action="${pageContext.request.contextPath}/auctions/${a.id}/delete"
							method="post">
							<button type="submit">
								<img src="img/delete.jpg" />
							</button>
				</form>
				</td>
				<td><p id="cacheMsg${a.auctionId}"></p></td>
				</tr>
			</c:forEach>
		</table>
		<br>
	</div>
	<!-- WebSocket connection -->

	<script src="scripts/sockjs-0.3.4.js"></script>
	<script src="scripts/stomp.js"></script>

	<script type="text/javascript">
		var stompClient = null;

		function connect() {
			var socket = new SockJS('/cache');
			stompClient = Stomp.over(socket);
			stompClient.connect({}, function(frame) {
				console.log('Connected: ' + frame);
				stompClient.subscribe('/topic/cacheOutdated', function(msg) {
					showCacheOutdated(JSON.parse(msg.body));
				});
			});
		}

		function disconnect() {
			if (stompClient != null) {
				stompClient.disconnect();
			}
			console.log("Disconnected");
		}

		function showCacheOutdated(response) {
			console.log(response);

			var username = response.username;

			// Is this message really for me or another user?
			if (username == "${userCredentials.username}") {
				// Is this session aware of such an auction?
				// The user might have opened multiple webbrowser windows
				// incrementally adding auction ids, which requires each instance
				// to test for auction ids it is holding.
				var cacheMsgTag = document.getElementById("cacheMsg" + response.auctionId);
				if (cacheMsgTag != null) {
					cacheMsgTag.innerHTML = response.msg;
				}

				var cacheCountTag = document.getElementById("cacheCount" + response.auctionId);
				if (cacheCountTag != null) {
					cacheCountTag.innerHTML = response.cacheCount;
				}
			}
		}
	</script>
</body>
</html>