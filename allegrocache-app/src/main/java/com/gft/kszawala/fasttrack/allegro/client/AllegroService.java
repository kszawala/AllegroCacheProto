package com.gft.kszawala.fasttrack.allegro.client;

import com.gft.kszawala.fasttrack.allegro.client.generatedclasses.ItemInfo;
import com.gft.kszawala.fasttrack.model.SessionInfo;
import com.gft.kszawala.fasttrack.model.UserCredentials;

/**
 * Interface for interaction with Allegro WEB Api (http://allegro.pl/webapi).
 *
 * @author kfsw
 *
 */
public interface AllegroService {

	/**
	 * @param auctionId
	 * @param credentials
	 * @return @see
	 *         http://allegro.pl/webapi/documentation.php/show/id,52#method-output
	 */
	ItemInfo getItemInfo(final Long auctionId, final UserCredentials credentials);

	/**
	 * @param credentials
	 * @return session handle for the user (allows for password-less interaction
	 *         with Allegro API).
	 */
	SessionInfo createSessionInfo(final UserCredentials credentials);
}
