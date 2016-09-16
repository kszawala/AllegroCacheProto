package com.gft.kszawala.fasttrack.allegro.cache;

import com.gft.kszawala.fasttrack.allegro.cache.states.CacheState;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.websocket.CacheEventNotifier;

/**
 * Interface for updating cache of a given Auction. Each Auction has a dedicated
 * Updater.
 *
 * @author kfsw
 *
 */
public interface CacheUpdater {

	/**
	 * @param state
	 *            - new state of the updater.
	 */
	void setState(final CacheState state);

	/**
	 * Update cache.
	 *
	 * @param cacheUpdatedNotifier
	 *            - notifier to notify on completion.
	 */
	void update(final CacheEventNotifier cacheUpdatedNotifier);

	/**
	 * @param avatar
	 *            - auction, for which cache is to be updated.
	 */
	void setAvatar(final AuctionAvatar avatar);
}
