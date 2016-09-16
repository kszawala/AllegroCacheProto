package com.gft.kszawala.fasttrack.allegro.cache;

import com.gft.kszawala.fasttrack.allegro.client.AllegroClient;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.UserCredentials;
import com.gft.kszawala.fasttrack.model.dao.AuctionContentDao;

/**
 * Interface for factory for CacheUpdater objects.
 *
 * @author kfsw
 */
public interface CacheUpdaterFactory {

	/**
	 * @param avatar
	 * @param contentDao
	 * @param allegroClient
	 * @param credentials
	 * @return a new instance of CacheUpdater
	 */
	CacheUpdater create(AuctionAvatar avatar, AuctionContentDao contentDao, AllegroClient allegroClient, UserCredentials credentials);
}