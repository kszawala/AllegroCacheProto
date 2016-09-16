package com.gft.kszawala.fasttrack.allegro.cache.states;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.Test;

import com.gft.kszawala.fasttrack.allegro.cache.CacheUpdater;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.AuctionContent;
import com.gft.kszawala.fasttrack.model.dao.AuctionContentDao;
import com.gft.kszawala.fasttrack.websocket.CacheEventNotifier;
import com.gft.kszawala.fasttrack.websocket.response.Response;
import com.gft.kszawala.fasttrack.websocket.response.ResponseFactory;

public class CacheInitializedStateTest {

	@Test
	public void testResponseFactoryCreatesResponseBasedOnTheGivenAuction() {

		final CacheEventNotifier notifier = mock(CacheEventNotifier.class);
		final ResponseFactory responseFactory = mock(ResponseFactory.class);
		final CacheState initializedState = CacheStateTestHelper.createCacheInitializedState(responseFactory);

		final AuctionAvatar avatar = mock(AuctionAvatar.class);

		initializedState.broadcastCacheUpdateNotification(notifier, avatar);

		verify(responseFactory).create(eq(avatar), anyString());
	}

	@Test
	public void testResponseFactoryCreatesResponseThatIsBroadcast() {

		final CacheEventNotifier notifier = mock(CacheEventNotifier.class);
		final ResponseFactory responseFactory = mock(ResponseFactory.class);
		final Response response = mock(Response.class);
		when(responseFactory.create((AuctionAvatar) any(), anyString())).thenReturn(response);
		final CacheState initializedState = CacheStateTestHelper.createCacheInitializedState(responseFactory);

		final AuctionAvatar auction = mock(AuctionAvatar.class);

		initializedState.broadcastCacheUpdateNotification(notifier, auction);

		verify(notifier).broadcast(response);
	}

	@Test
	public void testStateIsChangedWhenCacheBecomesFull() {

		final CacheUpdater cacheUpdater = mock(CacheUpdater.class);
		final CacheState initializedState = CacheStateTestHelper.createCacheInitializedState();
		final AuctionAvatar avatarFull = CacheStateTestHelper.createAuctionWithFullCache();

		initializedState.updateCache(cacheUpdater, avatarFull);

		verify(cacheUpdater).setState((CacheFullState) any());
	}

	@Test
	public void testStateIsNotChangedUntilCacheIsFull() {

		final CacheUpdater cacheUpdater = mock(CacheUpdater.class);

		final CacheState initializedState = CacheStateTestHelper.createCacheInitializedState();
		initializedState.updateCache(cacheUpdater, CacheStateTestHelper.createAvatarWithNoContent());

		verify(cacheUpdater, times(0)).setState((CacheState) any());
	}

	@Test
	public void testNewCacheEntryIsSavedWithDao() {

		final AuctionContentDao contentDao = mock(AuctionContentDao.class);
		final CacheState initializedState = CacheStateTestHelper.createCacheInitializedState(contentDao);
		final AuctionAvatar avatar = CacheStateTestHelper.createAvatarWithNoContent();

		initializedState.updateCache(mock(CacheUpdater.class), avatar);

		verify(contentDao).add((AuctionContent) any(), eq(avatar));
	}
}
