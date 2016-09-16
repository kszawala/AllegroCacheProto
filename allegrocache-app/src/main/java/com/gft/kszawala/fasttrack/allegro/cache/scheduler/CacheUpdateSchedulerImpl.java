package com.gft.kszawala.fasttrack.allegro.cache.scheduler;

import java.util.Set;

import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.gft.kszawala.fasttrack.allegro.cache.CacheUpdater;
import com.gft.kszawala.fasttrack.allegro.cache.CacheUpdaterSetFactory;
import com.gft.kszawala.fasttrack.websocket.CacheEventNotifier;

@Service
@Transactional
/**
 * Class in charge of updating cache every so often.
 *
 * @injects CacheEventNotifier - notifies subscribers that a particular cache
 *          has been updated
 * @injects CacheUpdaterSetFactoryImpl - creates a set of CacheUpdater objects
 *          for each user for each auction.
 *
 * @author kfsw
 *
 */
public class CacheUpdateSchedulerImpl {

	private static final Log logger = LogFactory.getLog(CacheUpdateSchedulerImpl.class);

	@Autowired
	private CacheEventNotifier cacheEventNotifier;
	@Autowired
	private CacheUpdaterSetFactory cacheUpdaterSetFactory;

	@Scheduled(fixedDelayString = "${fixedDelay.in.milliseconds}")
	/**
	 * Update caches of all Auctions currently being watched by all users.
	 */
	public void onInterval() {

		logger.info("updating cache");

		final Set<CacheUpdater> cacheUpdaters = cacheUpdaterSetFactory.create();
		logger.info(String.format("About to launch %d cache updaters!", cacheUpdaters.size()));

		// It is a bottle neck for the app. The more users logged in and the
		// more auctions the longer the sequential
		// loop takes. Think of parallel execution instead.
		cacheUpdaters.forEach(as -> {
			as.update(cacheEventNotifier);
		});
	}
}
