package com.gft.kszawala.fasttrack.allegro.client;

import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.AuctionContent;
import com.gft.kszawala.fasttrack.model.SessionInfo;
import com.gft.kszawala.fasttrack.model.UserCredentials;

/**
 * Interface for interaction with Allegro.
 *
 * At the time this service was designed Allegro SA started work on REST API. A
 * potential path to extend the service is to add a REST implementation.
 * 
 * @author kfsw
 *
 */
public interface AllegroClient {

	/**
	 * @param auctionId
	 * @param credentials
	 * @return instance of Cache representing auction state.
	 */
	AuctionContent fetchAuctionContent(Long auctionId, UserCredentials credentials);

	/**
	 *
	 * @param auctionId
	 * @param credentials
	 * @return instance of auction state.
	 */
	AuctionAvatar fetchAuctionAvatar(Long auctionId, UserCredentials credentials);

	/**
	 *
	 * @param credentials
	 * @return instance of Allegro Session handle for the user.
	 */
	SessionInfo requestSessionInfo(UserCredentials credentials);
}