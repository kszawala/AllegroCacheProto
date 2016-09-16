package com.gft.kszawala.fasttrack.allegro.cache;

import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.gft.kszawala.fasttrack.allegro.client.AllegroClient;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.UserCredentials;
import com.gft.kszawala.fasttrack.model.dao.AuctionAvatarDao;
import com.gft.kszawala.fasttrack.model.dao.AuctionContentDao;
import com.gft.kszawala.fasttrack.model.dao.UserCredentialsDao;

@RunWith(MockitoJUnitRunner.class)
public class CacheUpdaterSetFactoryTest {

	@Mock
	AuctionAvatarDao avatarDao;
	@Mock
	AuctionContentDao contentDao;
	@Mock
	UserCredentialsDao credentialsDao;
	@Mock
	AllegroClient allegroClient;
	@Mock
	CacheUpdaterFactory cuFactory;

	@InjectMocks
	CacheUpdaterSetFactoryImpl setFactory;

	@Test
	public void testCacheUpdaterIsCreatedForEachAuctionOfEachUser() {

		// User == UserCredentials.

		final List<UserCredentials> credentials = Arrays.asList(mock(UserCredentials.class),
				mock(UserCredentials.class), mock(UserCredentials.class));
		final int USERS = credentials.size();

		given(credentialsDao.getAll()).willReturn(credentials);

		final List<AuctionAvatar> avatars = Arrays.asList(mock(AuctionAvatar.class), mock(AuctionAvatar.class));
		given(avatarDao.getUserAvatars(anyString())).willReturn(avatars);
		final int AUCTIONS = avatars.size();

		setFactory.create();

		// for each user for each auction there is a dedicated cache updater
		// created.
		verify(cuFactory, times(AUCTIONS * USERS)).create(any(), any(), any(), any());
	}

	@Test
	public void testNoCacheUpdaterIsCreatedWhenNoAuctionIsWatched() {

		final List<UserCredentials> credentials = Arrays.asList(mock(UserCredentials.class),
				mock(UserCredentials.class), mock(UserCredentials.class));

		given(credentialsDao.getAll()).willReturn(credentials);

		final List<AuctionAvatar> avatars = new LinkedList<AuctionAvatar>(); // THERE_ARE_NO_AUCTIONS!
		given(avatarDao.getUserAvatars(anyString())).willReturn(avatars);

		setFactory.create();

		// Since there are no auctions, therefore no CacheUpdater is needed.
		verify(cuFactory, times(0)).create(any(), any(), any(), any());
	}

	@Test
	public void testNoCacheUpdaterIsCreatedWhenNobodyIsLoggedIn() {

		// A situation, when two auctions exist, and no user is available is an
		// error. However, if it happens, no cache updater is to be created -
		// who would watch the updates?
		given(credentialsDao.getAll()).willReturn(new LinkedList<UserCredentials>());

		final List<AuctionAvatar> avatars = Arrays.asList(mock(AuctionAvatar.class), mock(AuctionAvatar.class));
		given(avatarDao.getUserAvatars(anyString())).willReturn(avatars);

		setFactory.create();

		verify(cuFactory, times(0)).create(any(), any(), any(), any());
	}

}
