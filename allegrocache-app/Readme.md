#RUN:
Windows: mvn clean install & java -jar target\allegro-cache-app-0.0.1-SNAPSHOT.jar
Web Browser: http://localhost:9090/

#TEST RUN (no connection to allegro):
mvn clean install & java -jar target\allegro-cache-app-0.0.1-SNAPSHOT.jar --spring.profiles.active=test

#ADDITIONAL NOTES:
* Structure of the project (location of jsp folder) has been altered compared to
its ususal location (src/main/webapp/WEB-INF/jsp) to enable
JSP from Spring Boot which otherwise would not work (it works fine with classic
Spring).
* Angular integration with WebSocket uses Maik Hummel's ngStomp
(@see https://github.com/beevelop/ng-stomp).

#Read more at:
https://dzone.com/articles/spring-boot-with-jsps-in-executable-jars-1