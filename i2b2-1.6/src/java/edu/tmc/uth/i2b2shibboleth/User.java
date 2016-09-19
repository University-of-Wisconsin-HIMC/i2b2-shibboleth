/* Copyright 2011 University of Texas Health Science Center at Houston

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

package edu.tmc.uth.i2b2shibboleth;

/**Holds basic identifying information about the authenticated user.
 *
 * @author JRussell
 */
public class User {
    public String first, last, email, identifier, session;
    
    public User(String first, String last, String email, String identifier, String session){
        this.first = first;
        this.last = last;
        this.email = email;
        this.identifier = identifier;
        this.session = session;
    }
    
    public String getIdentifier(){
        return identifier;
    }
    
    public String getSession(){
        return session;
    }
    
    public String toString(){
        return first+" "+last+" "+email+" "+identifier;
    }
}
