package com.gft.kszawala.fasttrack.allegro.cache;

import com.gft.kszawala.fasttrack.allegro.cache.states.CacheState;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.websocket.CacheEventNotifier;

public class CacheUpdaterImpl implements CacheUpdater {

	private CacheState currentState;

	private AuctionAvatar avatar;

	public CacheUpdaterImpl(final CacheState initialState) {

		this.currentState = initialState;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void setState(final CacheState state) {

		this.currentState = state;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void update(final CacheEventNotifier cacheUpdatedNotifier) {

		currentState.updateCache(this, avatar);
		currentState.broadcastCacheUpdateNotification(cacheUpdatedNotifier, avatar);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void setAvatar(final AuctionAvatar avatar) {

		this.avatar = avatar;
	}
}
