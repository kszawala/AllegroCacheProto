<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Login</title>
<!-- LINK rel="stylesheet" href="css/default.css" type="text/css"-->
<LINK rel="stylesheet" href="css/div.css" type="text/css">
</head>
<body background="img/jsp.jpg">
	<div style="background-color: white">
		<table>
			<tr>
				<td><img src="img/allegro-webapi.jpg" /></td>
				<td><a href="http://allegro.pl/webapi">Want to obtain
						Allegro Web API log-in credentials?</a></td>
			</tr>
		</table>


		<form:form commandName="userCredentials">
			<form:errors path="" element="div" />
			<!--form:errors path="*" cssClass="errorBlock" element="div"/-->
			<!-- * means I want all of the errors to be displayed here -->
			<table>
				<tr>
					<td>User:</td>
					<td><form:input path="username" /></td>
					<!-- td><form:errors path="username" cssClass="error" /></td-->
				</tr>
				<tr>
					<td>Password:</td>
					<td><form:password path="password" /></td>
					<!--td><form:errors path="password" cssClass="error" /></td-->
				</tr>
				<tr>
					<td>Web API Key:</td>
					<td><form:input path="webApiKey" /></td>
					<!--td><form:errors path="webApiKey" cssClass="error" /></td-->
				</tr>
				<tr>
					<td><input type="submit" value="Log in" /></td>
					<td align="right">${loginErrorMsg}</td>
				</tr>
			</table>
		</form:form>
	</div>
</body>
</html>