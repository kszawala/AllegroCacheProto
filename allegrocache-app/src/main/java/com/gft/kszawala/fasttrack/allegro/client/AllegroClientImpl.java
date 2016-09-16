package com.gft.kszawala.fasttrack.allegro.client;

import java.util.Date;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.gft.kszawala.fasttrack.allegro.client.generatedclasses.ItemInfo;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.AuctionContent;
import com.gft.kszawala.fasttrack.model.SessionInfo;
import com.gft.kszawala.fasttrack.model.UserCredentials;

/**
 * Allegro Web API access layer.
 *
 * @injects AllegroService for interacting with Allegro WEB API SOAP
 *          WebServices.
 *
 * @author kfsw
 */
public class AllegroClientImpl implements AllegroClient {

	private static Log logger = LogFactory.getLog(AllegroClientImpl.class);

	@Autowired
	AllegroService allegroService;

	/**
	 * {@inheritDoc}
	 */
	@Override
	public AuctionContent fetchAuctionContent(final Long auctionId, final UserCredentials credentials) {

		final ItemInfo itemInfo = allegroService.getItemInfo(auctionId, credentials);

		final AuctionContent content = new AuctionContent();
		content.setItName(itemInfo.getItName());
		content.setItBidCount(itemInfo.getItBidCount());
		content.setItBuyNowActive(itemInfo.getItBuyNowActive());
		content.setItHighBidder(itemInfo.getItHighBidder());
		content.setItHitCount(itemInfo.getItHitCount());
		content.setItId(itemInfo.getItId());
		content.setItPrice(itemInfo.getItPrice());
		content.setItBuyNowPrice(itemInfo.getItBuyNowPrice());
		content.setTimestamp(new Date().getTime());

		return content;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public AuctionAvatar fetchAuctionAvatar(final Long auctionId, final UserCredentials credentials) {

		final ItemInfo itemInfo = allegroService.getItemInfo(auctionId, credentials);

		final AuctionAvatar avatar = new AuctionAvatar();
		avatar.setId(itemInfo.getItId(), credentials.getUsername());
		avatar.setName(itemInfo.getItName());
		avatar.setAuctionId(itemInfo.getItId());

		avatar.setUsername(credentials.getUsername());

		return avatar;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public SessionInfo requestSessionInfo(final UserCredentials credentials) {

		logger.info("attempt to login, userId: " + credentials.getUsername());

		return allegroService.createSessionInfo(credentials);
	}

}
