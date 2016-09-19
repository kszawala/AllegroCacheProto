package com.gft.kszawala.fasttrack.allegro.cache.states;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.gft.kszawala.fasttrack.allegro.cache.CacheUpdater;
import com.gft.kszawala.fasttrack.allegro.client.AllegroClient;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.UserCredentials;
import com.gft.kszawala.fasttrack.model.dao.AuctionAvatarDao;
import com.gft.kszawala.fasttrack.websocket.CacheEventNotifier;
import com.gft.kszawala.fasttrack.websocket.response.Response;
import com.gft.kszawala.fasttrack.websocket.response.ResponseFactory;

/**
 * State of CacheUpdater representing the case when auction cache being updated
 * by the Updater is Full and therefore no longer able to accept new cache
 * entries.
 *
 * @author kfsw
 *
 */
public class CacheFullState implements CacheState {

	private static final Log logger = LogFactory.getLog(CacheFullState.class);

	private final AuctionAvatarDao avatarDao;
	private final UserCredentials credentials;
	private final AllegroClient allegroClient;
	private final ResponseFactory responseFactory;

	public CacheFullState(final AuctionAvatarDao avatarDao, final AllegroClient allegroClient,
			final UserCredentials credentials) {

		this(avatarDao, allegroClient, credentials, new ResponseFactory());
	}

	public CacheFullState(final AuctionAvatarDao avatarDao, final AllegroClient allegroClient,
			final UserCredentials credentials, final ResponseFactory responseFactory) {

		this.avatarDao = avatarDao;
		this.allegroClient = allegroClient;
		this.credentials = credentials;
		this.responseFactory = responseFactory;
	}

	/**
	 * {@inheritDoc}
	 *
	 * Include a message to the Response for the notifier indicating that cache
	 * is full.
	 */
	@Override
	public void broadcastCacheUpdateNotification(final CacheEventNotifier cacheUpdatedNotifier,
			final AuctionAvatar avatar) {

		final Response response = responseFactory.create(avatar, "Full");
		cacheUpdatedNotifier.broadcast(response);
	}

	/**
	 * {@inheritDoc}
	 *
	 * When cache of the auction is no longer full then state of the updater is
	 * switched back to CacheInitializedState, otherwise keep the state such as
	 * is.
	 */
	@Override
	public void updateCache(final CacheUpdater updater, final AuctionAvatar avatar) {

		if (avatar.isCacheFull()) {
			logger.info(String.format("Cache for auction id = %s is full! Skipping.", avatar.getAuctionId()));
		}
		else {
			updater.setState(new CacheInitializedState(avatarDao, allegroClient, this, credentials));
			logger.info(String.format("Cache for auction id = %s is no longer full!", avatar.getAuctionId()));
		}
	}
}