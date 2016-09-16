package com.gft.kszawala.fasttrack.allegro.cache;

import java.util.Set;

/**
 * Interface for creating a set of cache updaters.
 *
 * @author kfsw
 *
 */
public interface CacheUpdaterSetFactory {

	/**
	 * @return collection of cache updaters for all users and auctions.
	 */
	Set<CacheUpdater> create();
}