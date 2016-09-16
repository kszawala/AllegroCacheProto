package com.gft.kszawala.fasttrack.allegro.cache;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import org.junit.Test;
import org.mockito.InOrder;
import org.mockito.Mockito;

import com.gft.kszawala.fasttrack.allegro.cache.states.CacheState;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.websocket.CacheEventNotifier;

public class CacheUpdaterTest {

	@Test
	public void testUpdateAndBroadcastIsDoneOnTheInitialState() {

		final CacheState iniState = mock(CacheState.class);
		final CacheUpdater updater = new CacheUpdaterImpl(iniState);

		updater.update(mock(CacheEventNotifier.class));

		verify(iniState).updateCache(any(), any());
		verify(iniState).broadcastCacheUpdateNotification(any(), any());
	}

	@Test
	public void testUpdateAndBroadcastIsDoneOnTheNewState() {

		final CacheState newState = mock(CacheState.class);
		final CacheUpdater updater = new CacheUpdaterImpl(mock(CacheState.class));
		updater.setState(newState); // override the initial state!

		updater.update(mock(CacheEventNotifier.class));

		verify(newState).updateCache(any(), any());
		verify(newState).broadcastCacheUpdateNotification(any(), any());
	}

	@Test
	public void testAuctionIsPassedToState() {

		final CacheState state = mock(CacheState.class);
		final CacheUpdater updater = new CacheUpdaterImpl(state);
		final AuctionAvatar avatar = mock(AuctionAvatar.class);
		updater.setAvatar(avatar);

		final CacheEventNotifier notifier = mock(CacheEventNotifier.class);
		updater.update(notifier);

		// Update should be called against the auction set.
		verify(state).updateCache(any(), eq(avatar));
		// Broadcast should be done on the given notifier and auction.
		verify(state).broadcastCacheUpdateNotification(eq(notifier), eq(avatar));
	}

	@Test
	public void testBroadcastHappensAfterUpdate() {

		final CacheState state = mock(CacheState.class);
		final InOrder inOrder = Mockito.inOrder(state);

		new CacheUpdaterImpl(state).update(mock(CacheEventNotifier.class));

		inOrder.verify(state).updateCache(any(), any());
		inOrder.verify(state).broadcastCacheUpdateNotification(any(), any());
	}

}
