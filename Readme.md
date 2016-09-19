A multi-module project to package AllegroCache-app with its dependencies so that
it is self-contained.

#BUILD:
mvn clean install

#RUN:
* Production:
Windows: java -jar allegrocache-app\target\allegro-cache-app-0.0.1-SNAPSHOT.jar
Firefox: http://localhost:9090/

* Test (no connection to allegro):
Windows: java -jar allegrocache-app\target\allegro-cache-app-0.0.1-SNAPSHOT.jar --spring.profiles.active=test
Firefox: http://localhost:9090/

#ADDITIONAL NOTES:
See allegrocache-app\Readme.md