package com.gft.kszawala.fasttrack.controller;

import java.util.List;

import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.gft.kszawala.fasttrack.allegro.client.AllegroClient;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.AuctionIdentifier;
import com.gft.kszawala.fasttrack.model.UserCredentials;
import com.gft.kszawala.fasttrack.model.dao.AuctionAvatarDao;
import com.gft.kszawala.fasttrack.properties.AllegroProperties;

/**
 * Spring MVC controller class for AuctionAvatar. @see AuctionAvatar.
 *
 * @injects AuctionAvatarDao for interaction with Auction Avatar DB.
 * @injects AllegroClient for interaction with Allegro WEB API.
 * @injects AllegroProperties for accessing allegro-related configuration.
 *
 * @author kfsw
 *
 */
@Controller
@SessionAttributes({ LoginController.USER_CREDENTIALS_ID })
@Transactional
public class AuctionAvatarController {

	private static final Log logger = LogFactory.getLog(AuctionAvatarController.class);

	@Autowired
	private AuctionAvatarDao avatarDao;

	@Autowired
	private AllegroClient allegroClient;

	@Autowired
	private AllegroProperties allegroProps;

	/**
	 * HTTP GET request for all Auction Avatars for the given user.
	 *
	 * @param credentials
	 *            - the User's credentials.
	 * @param model
	 *            - reference to the model. Attributes being set:
	 *            <ul>
	 *            <li>"auction" - new auction (set to emtpy),
	 *            <li>"auctions" - all user's Auction Avatars,
	 *            <li>"auctionIdentifier" - AuctionIdentifier object for the
	 *            user,
	 *            <li>"allegroHome" - the configured Allegro.pl home URL.
	 *            </ul>
	 * @return "auctions" view name.
	 */
	@RequestMapping(path = "/auctions", method = RequestMethod.GET)
	public String displayAvatarList(
			@ModelAttribute(LoginController.USER_CREDENTIALS_ID) final UserCredentials credentials, final Model model) {

		logger.info("about to display Auction list for user: " + credentials.getUsername());

		final List<AuctionAvatar> avatars = avatarDao.getUserAvatars(credentials.getUsername());

		model.addAttribute("auction", new AuctionAvatar());
		model.addAttribute("auctions", avatars);
		model.addAttribute("auctionIdentifier", new AuctionIdentifier());
		model.addAttribute("allegroHome", allegroProps.getHome());

		logger.info("auction ids: ");
		avatars.forEach(a -> logger.info(a.getAuctionId()));

		return "auctions";
	}

	/**
	 * HTTP POST request for adding a new Auction Avatar. The method fetches
	 * Auction Name based on the Auction Id, creates a new Avatar and persists
	 * it in DB using DAO.
	 *
	 * @param credentials
	 * @param auctionIdentifier
	 *            - identifies the Avatar id.
	 * @param model
	 *            - reference to the model.
	 * @return "redirect:auctions" view name.
	 */
	@RequestMapping(path = "/auctions", method = RequestMethod.POST)
	public String addAvatar(@ModelAttribute(LoginController.USER_CREDENTIALS_ID) final UserCredentials credentials,
			final AuctionIdentifier auctionIdentifier, final Model model) {

		logger.info("about to add a new auction to watch, id = " + auctionIdentifier.getAuctionId());
		logger.info("username = " + credentials.getUsername());

		try {
			final AuctionAvatar avatarFilled = allegroClient.fetchAuctionAvatar(auctionIdentifier.getAuctionId(),
					credentials);

			avatarDao.add(avatarFilled);
		}
		catch (final Exception e) {
			logger.error("Failed to add!", e);
		}

		return "redirect:auctions";
	}

	/**
	 * HTTP POST request for deleting a particular Auction Avatar.
	 *
	 * @param credentials
	 * @param id
	 *            - Auction Id of the Avatar to delete.
	 * @param model
	 * @return "redirect:/auctions" view name.
	 */
	@RequestMapping(path = "/auctions/{id}/delete", method = RequestMethod.POST)
	public String deleteAvatar(@ModelAttribute(LoginController.USER_CREDENTIALS_ID) final UserCredentials credentials,
			@PathVariable("id") final String id, final Model model) {

		logger.info("about to delete an auction id = " + id);

		try {
			avatarDao.remove(id);
		}
		catch (final Exception e) {
			logger.error("Failed to delete Avatar!", e);
		}

		// The forward slash ensures return to '/auctions', rather than
		// '/auctions/{id}/auctions' which was the case when starting path was
		// '/auctions/{id}/delete'.

		return "redirect:/auctions";
	}
}
