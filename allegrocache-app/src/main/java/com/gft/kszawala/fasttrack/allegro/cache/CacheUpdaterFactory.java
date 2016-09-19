package com.gft.kszawala.fasttrack.allegro.cache;

import com.gft.kszawala.fasttrack.allegro.client.AllegroClient;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.UserCredentials;
import com.gft.kszawala.fasttrack.model.dao.AuctionAvatarDao;

/**
 * Interface for factory for CacheUpdater objects.
 *
 * @author kfsw
 */
public interface CacheUpdaterFactory {

	/**
	 * @param avatar
	 * @param avatarDao
	 * @param allegroClient
	 * @param credentials
	 * @return a new instance of CacheUpdater
	 */
	CacheUpdater create(AuctionAvatar avatar, AuctionAvatarDao avatarDao, AllegroClient allegroClient,
			UserCredentials credentials);
}