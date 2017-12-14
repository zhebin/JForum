package net.jforum.sso;

import java.util.logging.Logger;

import net.jforum.context.RequestContext;
import net.jforum.entities.UserSession;
import net.jforum.util.preferences.ConfigKeys;
import net.jforum.util.preferences.SystemGlobals;

public class HeaderUserSSO implements SSO {

	static final Logger logger = Logger.getLogger(HeaderUserSSO.class.getName());

	public String authenticateUser(RequestContext request) {
		// login cookie set by my web LOGIN application
		String username = request.getHeader("iv-user");
		logger.info("request header username=" + username);
		return username; 
		// jforum will use this name to regist database or set in HttpSession
	}

	public boolean isSessionValid(UserSession userSession,
			RequestContext request) {
		String remoteUser = request.getHeader("iv-user");


		if (remoteUser == null && userSession.getUserId() != SystemGlobals.getIntValue(ConfigKeys.ANONYMOUS_USER_ID)) {
			// user has since logged out
//			return false;
		} else if (remoteUser != null && userSession.getUserId() == SystemGlobals.getIntValue(ConfigKeys.ANONYMOUS_USER_ID)) {
			// anonymous user has logged in
			return false;
		} else if (remoteUser != null && !remoteUser.equals(userSession.getUsername())) {
			// not the same user (cookie and session)
			return false;
		}
		return true; // myapp user and forum user the same. valid user.
	}

}
