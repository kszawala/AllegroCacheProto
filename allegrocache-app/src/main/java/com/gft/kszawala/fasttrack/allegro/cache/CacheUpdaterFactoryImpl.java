package com.gft.kszawala.fasttrack.allegro.cache;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import com.gft.kszawala.fasttrack.allegro.cache.states.CacheFullState;
import com.gft.kszawala.fasttrack.allegro.cache.states.CacheInitializedState;
import com.gft.kszawala.fasttrack.allegro.client.AllegroClient;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.UserCredentials;
import com.gft.kszawala.fasttrack.model.dao.AuctionAvatarDao;

@Service
public class CacheUpdaterFactoryImpl implements CacheUpdaterFactory {

	private static final Log logger = LogFactory.getLog(CacheUpdaterFactoryImpl.class);

	@Override
	/**
	 * {@inheritDoc}
	 */
	public CacheUpdater create(final AuctionAvatar avatar, final AuctionAvatarDao avatarDao,
			final AllegroClient allegroClient, final UserCredentials credentials) {

		final CacheFullState fullState = new CacheFullState(avatarDao, allegroClient, credentials);
		final CacheInitializedState initState = new CacheInitializedState(avatarDao, allegroClient, fullState,
				credentials);
		final CacheUpdater updater = new CacheUpdaterImpl(initState);

		logger.info("creating CacheUpdater for auction id = " + avatar.getAuctionId());
		logger.info("updater hash=" + updater.hashCode());

		updater.setAvatar(avatar);

		return updater;
	}
}
