Organization:

UW Health / http://www.uwhealth.org

Compatibility with i2b2:

i2b2 1.7.04

Other requirements:

# java -version
java version "1.7.0_60"
Java(TM) SE Runtime Environment (build 1.7.0_60-b19)
Java HotSpot(TM) Server VM (build 24.60-b09, mixed mode)

services on Linux:

service jboss [status,stop,start,restart]
service httpd [status,stop,start,restart]
service tomcat [status,stop,start,restart]

Java Compilation Path(s):

\src\java\uwhealth\i2b2\shibboleth\

Compiled Byte Code:

\out\production\i2b2-shibboleth\uwhealth\i2b2\shibboleth\

Copy "uwhealth" folder from above into Tomcat Deployment folder:

/opt/{tomcat folder}/webapps/i2b2/WEB-INF/classes/
