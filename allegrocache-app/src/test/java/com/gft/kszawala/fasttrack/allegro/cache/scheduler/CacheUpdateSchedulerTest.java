package com.gft.kszawala.fasttrack.allegro.cache.scheduler;

import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import java.util.HashSet;
import java.util.Set;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.gft.kszawala.fasttrack.allegro.cache.CacheUpdater;
import com.gft.kszawala.fasttrack.allegro.cache.CacheUpdaterImpl;
import com.gft.kszawala.fasttrack.allegro.cache.CacheUpdaterSetFactory;
import com.gft.kszawala.fasttrack.websocket.CacheEventNotifier;

@RunWith(MockitoJUnitRunner.class)
public class CacheUpdateSchedulerTest {

	@Mock
	private CacheEventNotifier notifier;

	@Mock
	CacheUpdaterSetFactory cacheUpdaterSetFactory;

	@InjectMocks
	private CacheUpdateSchedulerImpl scheduler;

	@Test
	public void testEachCacheUpdaterNotifies() {

		// Assumed that 3 cache updaters would be representative enough.
		final Set<CacheUpdater> updaters = new HashSet<CacheUpdater>();
		updaters.add(mock(CacheUpdaterImpl.class));
		updaters.add(mock(CacheUpdaterImpl.class));
		updaters.add(mock(CacheUpdaterImpl.class));

		given(cacheUpdaterSetFactory.create()).willReturn(updaters);

		// It is a @Scheduled method meaning, that besides the explicit call it
		// will also be invoked by container.
		scheduler.onInterval();

		updaters.forEach(u -> {
			verify(u).update(eq(notifier));
		});
	}
}
