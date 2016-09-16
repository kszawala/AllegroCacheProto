package com.gft.kszawala.fasttrack.allegro.cache.states;

import com.gft.kszawala.fasttrack.allegro.cache.CacheUpdater;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.websocket.CacheEventNotifier;

public interface CacheState {

	/**
	 * Update cache of the given auction.
	 *
	 * @param updater
	 *            - updater handle to allow for changing its state (@see
	 *            CacheUpdater.setState).
	 * @param avatar
	 *            - auction, for which cache is updated with a new entry.
	 */
	void updateCache(final CacheUpdater updater, final AuctionAvatar avatar);

	/**
	 * Broadcast response on cache update for the given Auction has been
	 * recorded.
	 *
	 * @see com.gft.kszawala.fasttrack.websocket.Response.
	 *
	 * @param cacheUpdatedNotifier
	 *            - notifier object that is able to broadcast Response to all
	 *            the subscribers.
	 * @param avatar
	 *            - auction, for which a new cache entry was recorded.
	 */
	void broadcastCacheUpdateNotification(final CacheEventNotifier cacheUpdatedNotifier, final AuctionAvatar avatar);
}
