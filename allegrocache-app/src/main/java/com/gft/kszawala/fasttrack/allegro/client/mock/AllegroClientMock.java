package com.gft.kszawala.fasttrack.allegro.client.mock;

import java.util.Date;
import java.util.Random;

import com.gft.kszawala.fasttrack.allegro.client.AllegroClientImpl;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.AuctionContent;
import com.gft.kszawala.fasttrack.model.SessionInfo;
import com.gft.kszawala.fasttrack.model.UserCredentials;

/**
 * Mock class to break dependency on Allegro Web API.
 *
 * @author kfsw
 *
 */
public class AllegroClientMock extends AllegroClientImpl {

	@Override
	public AuctionAvatar fetchAuctionAvatar(final Long auctionId, final UserCredentials credentials) {

		final AuctionAvatar avatar = new AuctionAvatar();
		avatar.setId(auctionId, credentials.getUsername());
		avatar.setAuctionId(auctionId);
		avatar.setName("mockName");

		avatar.setUsername(credentials.getUsername());

		return avatar;
	}

	@Override
	public SessionInfo requestSessionInfo(final UserCredentials credentials) {

		final SessionInfo sessionInfo = new SessionInfo();
		sessionInfo.setModified(new Date());

		// Randomize session id (otherwise no multiuser testing possible).
		final int seed = new Random().nextInt();
		final double sessionId = new Random(seed).nextDouble();

		sessionInfo.setSessionHandle(String.valueOf(sessionId));

		return sessionInfo;
	}

	@Override
	public AuctionContent fetchAuctionContent(final Long auctionId, final UserCredentials credentials) {

		final AuctionContent auctionContent = new AuctionContent();

		// Simulate bidding.
		final float BUY_NOW_PRICE = 1 + (new Random().nextInt(344)); // randomize_1..344_PLN
		auctionContent.setItBuyNowPrice(BUY_NOW_PRICE); // seller_alters_buy_now_price

		auctionContent.setItBuyNowActive(1);
		auctionContent.setItHighBidder(0);
		auctionContent.setItHitCount(10);
		auctionContent.setItId(auctionId);
		auctionContent.setItName("a mocked auction name");

		auctionContent.setItBidCount(0); // no bidders
		auctionContent.setItPrice(0); // 0PLN since there are no bidders

		auctionContent.setTimestamp(new Date().getTime());

		return auctionContent;
	}
}
