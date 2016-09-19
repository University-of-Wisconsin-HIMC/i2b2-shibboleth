package uwhealth.i2b2.shibboleth;

import javax.servlet.http.*;
import javax.servlet.*;
// http://www.xyzws.com/servletfaq/when-do-i-use-httpsessionlistener/7

//@WebListener
public class AuthListener implements HttpSessionListener {

    public void sessionCreated(HttpSessionEvent se)
    {
        System.out.println("session");


    }
    public void sessionDestroyed(HttpSessionEvent se)
    {

    }


}

//<listener>
//<listener-class>uwhealth.i2b2.shibboleth.AuthListener</listener-class>
//</listener>