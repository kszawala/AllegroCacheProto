package com.gft.kszawala.fasttrack.controller;

import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.gft.kszawala.fasttrack.allegro.client.AllegroClient;
import com.gft.kszawala.fasttrack.model.SessionInfo;
import com.gft.kszawala.fasttrack.model.UserCredentials;
import com.gft.kszawala.fasttrack.model.dao.UserCredentialsDao;

@Controller
// TODO - decide on a single way of handling sessionInfo (currently via
// ModelAttribute and DB)
@SessionAttributes({ LoginController.USER_CREDENTIALS_ID })
@Transactional
/**
 * Spring MVC Controller to handle Login requests.
 *
 * @injects AllegroClient for interaction with Allegro Web API.
 * @injects UserCredentialsDao for interaction with user credentials DB.
 *
 * @author kfsw
 *
 */
public class LoginController {

	private static Log logger = LogFactory.getLog(LoginController.class);
	public static final String USER_CREDENTIALS_ID = "userCredentials";
	private static final String ERROR_ATTRIBUTE = "loginErrorMsg";

	@Autowired
	private AllegroClient allegroClient;

	@Autowired
	private UserCredentialsDao credentialsDao;

	@RequestMapping(path = "/", method = RequestMethod.POST)
	/**
	 * Attempt to log in using allegroClient. On successful login store
	 * UserCredentials with credentialsDao.
	 *
	 * @param credentials
	 *            - user input
	 * @param model
	 * @return "login" web view in case of errors, otherwise
	 *         "redirect:auctions".
	 */
	public String attemptToLogin(final UserCredentials credentials, final Model model) {

		model.addAttribute(ERROR_ATTRIBUTE, "");

		try {
			logger.info(String.format("userid: %s webkey: %s", credentials.getUsername(), credentials.getWebApiKey()));

			final SessionInfo sessionInfo = allegroClient.requestSessionInfo(credentials);
			// sessionInfo.setUsername(credentials.getUsername());
			credentials.setSessionInfo(sessionInfo);
			credentialsDao.add(credentials);

			model.addAttribute(USER_CREDENTIALS_ID, credentials);

			return "redirect:auctions";
		}
		catch (final Exception e) {
			final String errMsg = "Failed to log in!";
			model.addAttribute(ERROR_ATTRIBUTE, errMsg + " Original error: " + e.getLocalizedMessage());
			logger.error(errMsg, e);
		}

		return "login";
	}

	@RequestMapping(path = "/", method = RequestMethod.GET)
	/**
	 * Prepare login model to prompt for login credentials.
	 *
	 * Adds UserCredentials instance as "userCredentials" attribute to the
	 * model. Fields of UserCredentials set to their default values.
	 *
	 * Add Error Message attribute as "loginErrorMsg". The error is initially
	 * empty.
	 *
	 * @param model
	 * @return "login" view name
	 */
	public String promptLogin(final Model model) {

		model.addAttribute(ERROR_ATTRIBUTE, "");

		final UserCredentials credentials = new UserCredentials();
		credentials.setUsername("");
		credentials.setPassword("");
		credentials.setWebApiKey("");
		model.addAttribute(LoginController.USER_CREDENTIALS_ID, credentials);

		return "login";
	}

}
