package com.gft.kszawala.fasttrack.allegro.cache.states;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.gft.kszawala.fasttrack.allegro.cache.CacheUpdater;
import com.gft.kszawala.fasttrack.allegro.client.AllegroClient;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.AuctionContent;
import com.gft.kszawala.fasttrack.model.UserCredentials;
import com.gft.kszawala.fasttrack.model.dao.AuctionContentDao;
import com.gft.kszawala.fasttrack.websocket.CacheEventNotifier;
import com.gft.kszawala.fasttrack.websocket.response.Response;
import com.gft.kszawala.fasttrack.websocket.response.ResponseFactory;

/**
 * State of CacheUpdater representing the case when auction cache being updated
 * by the Updater is still capable of accepting new cache entries.
 *
 * @author kfsw
 *
 */
public class CacheInitializedState implements CacheState {

	private static final Log logger = LogFactory.getLog(CacheInitializedState.class);

	private final CacheFullState fullState;

	private final AuctionContentDao contentDao;

	private final AllegroClient allegroClient;
	private final UserCredentials credentials;

	private final ResponseFactory responseFactory;

	public CacheInitializedState(final AuctionContentDao contentDao, final AllegroClient allegroClient,
			final CacheFullState fullState, final UserCredentials credentials) {

		this(contentDao, allegroClient, fullState, credentials, new ResponseFactory());
	}

	/**
	 * Constructor dedicated to unit testing - allows for setting custom
	 * responseFactory.
	 *
	 * @param contentDao
	 * @param allegroClient
	 * @param fullState
	 * @param credentials
	 * @param responseFactory
	 */
	public CacheInitializedState(final AuctionContentDao contentDao, final AllegroClient allegroClient,
			final CacheFullState fullState, final UserCredentials credentials, final ResponseFactory responseFactory) {
		this.contentDao = contentDao;
		this.allegroClient = allegroClient;
		this.fullState = fullState;
		this.credentials = credentials;
		this.responseFactory = responseFactory;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void broadcastCacheUpdateNotification(final CacheEventNotifier cacheUpdatedNotifier,
			final AuctionAvatar avatar) {

		final Response response = responseFactory.create(avatar, "");
		cacheUpdatedNotifier.broadcast(response);
	}

	/**
	 * {@inheritDoc}
	 *
	 * When auction becomes full, updater state is set to CacheFullState and no
	 * more cache entries are added to it. Otherwise, a new cache entry is added
	 * to the auction.
	 */
	@Override
	public void updateCache(final CacheUpdater updater, final AuctionAvatar avatar) {

		if (avatar.isCacheFull()) {
			logger.info(String.format("cache for auction id = %s has reached its capacity!", avatar.getAuctionId()));
			updater.setState(fullState);

			return;
		}

		final AuctionContent content = allegroClient.fetchAuctionContent(avatar.getAuctionId(), credentials);
		contentDao.add(content, avatar);
	}
}