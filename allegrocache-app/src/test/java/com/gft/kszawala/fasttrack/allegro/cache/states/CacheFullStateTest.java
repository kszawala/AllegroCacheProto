package com.gft.kszawala.fasttrack.allegro.cache.states;

import static org.junit.Assert.assertFalse;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.Test;
import org.mockito.ArgumentCaptor;

import com.gft.kszawala.fasttrack.allegro.cache.CacheUpdater;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.websocket.CacheEventNotifier;
import com.gft.kszawala.fasttrack.websocket.response.Response;
import com.gft.kszawala.fasttrack.websocket.response.ResponseFactory;

public class CacheFullStateTest {

	@Test
	public void testStateIsChangedWhenCacheIsEmptied() {

		final CacheUpdater cacheUpdater = mock(CacheUpdater.class);
		final CacheState fullState = CacheStateTestHelper.createCacheFullState();
		final AuctionAvatar avatarWithNoContent = CacheStateTestHelper.createAvatarWithNoContent();

		// Since the updater is running in full cache state, therefore cache for
		// the auction
		// must have been emptied.
		fullState.updateCache(cacheUpdater, avatarWithNoContent);

		// switch back to initializedState.
		verify(cacheUpdater).setState(any());
	}

	@Test
	public void testStateDoesNotChangeForFullCache() {

		final CacheUpdater cacheUpdater = mock(CacheUpdater.class);
		final CacheState fullState = CacheStateTestHelper.createCacheFullState();

		fullState.updateCache(cacheUpdater, CacheStateTestHelper.createAuctionWithFullCache());

		verify(cacheUpdater, times(0)).setState(any());
	}

	@Test
	public void testMessageInTheResponseIsNotEmpty() {

		// Prepare parameter captor for CacheEventNotifier.broadcast(response).
		final ArgumentCaptor<Response> notifierParam = ArgumentCaptor.forClass(Response.class);
		final CacheEventNotifier notifier = mock(CacheEventNotifier.class);
		final CacheState fullState = CacheStateTestHelper.createCacheFullState();

		// Broadcast.
		fullState.broadcastCacheUpdateNotification(notifier, mock(AuctionAvatar.class));

		// Capture and assert the response.
		verify(notifier).broadcast(notifierParam.capture());
		final Response response = notifierParam.getValue();
		assertFalse("When cache is full a non-empty user message is needed!", response.getMsg().trim().isEmpty());
	}

	@Test
	public void testResponseIsCreatedForTheBroadcastAuction() {

		final ResponseFactory responseFactory = mock(ResponseFactory.class);
		final AuctionAvatar auction = CacheStateTestHelper.createAuctionWithFullCache();
		final CacheState fullState = CacheStateTestHelper.createCacheFullState(responseFactory);

		fullState.broadcastCacheUpdateNotification(mock(CacheEventNotifier.class), auction);

		verify(responseFactory).create(eq(auction), anyString());
	}
}
