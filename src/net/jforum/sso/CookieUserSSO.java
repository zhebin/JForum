package net.jforum.sso;

import java.util.logging.Logger;

import javax.servlet.http.Cookie;

import net.jforum.ControllerUtils;
import net.jforum.context.RequestContext;
import net.jforum.entities.UserSession;
import net.jforum.util.preferences.ConfigKeys;
import net.jforum.util.preferences.SystemGlobals;

public class CookieUserSSO implements SSO {

	static final Logger logger = Logger.getLogger(CookieUserSSO.class.getName());

	public String authenticateUser(RequestContext request) {
		// login cookie set by my web LOGIN application
		Cookie cookieNameUser = ControllerUtils.getCookie(SystemGlobals.getValue(ConfigKeys.COOKIE_NAME_USER));
		String username = null;

		if (cookieNameUser != null) {
			username = cookieNameUser.getValue();
		}
		logger.info("cookie username=" + username);
		System.out.println("cookie username=" + username);
		return username; // return username for jforum
		// jforum will use this name to regist database or set in HttpSession
	}

	public boolean isSessionValid(UserSession userSession,
			RequestContext request) {
		Cookie cookieNameUser = ControllerUtils.getCookie(SystemGlobals
				.getValue(ConfigKeys.COOKIE_NAME_USER)); // user cookie
		String remoteUser = null;

		if (cookieNameUser != null) {
			remoteUser = cookieNameUser.getValue(); // jforum username
		}

		if (remoteUser == null && userSession.getUserId() != SystemGlobals.getIntValue(ConfigKeys.ANONYMOUS_USER_ID)) {
			// user has since logged out
			return false;
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
