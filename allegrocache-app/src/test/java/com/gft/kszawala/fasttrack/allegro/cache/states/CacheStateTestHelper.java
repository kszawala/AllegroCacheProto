package com.gft.kszawala.fasttrack.allegro.cache.states;

import static org.junit.Assert.assertFalse;
import static org.mockito.Mockito.mock;

import com.gft.kszawala.fasttrack.allegro.client.AllegroClient;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.AuctionContent;
import com.gft.kszawala.fasttrack.model.UserCredentials;
import com.gft.kszawala.fasttrack.model.dao.AuctionContentDao;
import com.gft.kszawala.fasttrack.websocket.response.ResponseFactory;

class CacheStateTestHelper {

	static AuctionAvatar createAuctionWithFullCache() {

		final AuctionAvatar avatarFull = new AuctionAvatar();
		while (!avatarFull.isCacheFull()) {
			avatarFull.getContents().add(new AuctionContent());
		}
		return avatarFull;
	}

	static AuctionAvatar createAvatarWithNoContent() {

		final AuctionAvatar avatar = new AuctionAvatar();

		assertFalse(avatar.isCacheFull());

		return avatar;
	}

	static CacheState createCacheInitializedState(final ResponseFactory responseFactory) {

		return new CacheInitializedState(mock(AuctionContentDao.class), mock(AllegroClient.class),
				mock(CacheFullState.class), mock(UserCredentials.class), responseFactory);
	}

	static CacheState createCacheInitializedState() {

		return createCacheInitializedState(mock(AuctionContentDao.class));
	}

	static CacheState createCacheInitializedState(final AuctionContentDao contentDao) {

		return new CacheInitializedState(contentDao, mock(AllegroClient.class), mock(CacheFullState.class),
				mock(UserCredentials.class));
	}

	static CacheFullState createCacheFullState() {

		return new CacheFullState(mock(AuctionContentDao.class), mock(AllegroClient.class),
				mock(UserCredentials.class));
	}

	static CacheFullState createCacheFullState(final ResponseFactory responseFactory) {

		return new CacheFullState(mock(AuctionContentDao.class), mock(AllegroClient.class), mock(UserCredentials.class),
				responseFactory);
	}
}
