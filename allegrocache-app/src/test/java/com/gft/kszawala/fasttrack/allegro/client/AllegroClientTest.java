package com.gft.kszawala.fasttrack.allegro.client;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.gft.kszawala.fasttrack.allegro.client.generatedclasses.ItemInfo;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.AuctionContent;
import com.gft.kszawala.fasttrack.model.SessionInfo;
import com.gft.kszawala.fasttrack.model.UserCredentials;

@RunWith(MockitoJUnitRunner.class)
public class AllegroClientTest {

	@Mock
	AllegroService service;

	@InjectMocks
	AllegroClientImpl client;

	@Test
	public void test_requestSessionInfo_DelegatesToAllegroService() {

		final UserCredentials credentials = mock(UserCredentials.class);
		when(service.createSessionInfo(any())).thenReturn(mock(SessionInfo.class));

		client.requestSessionInfo(credentials);

		verify(service).createSessionInfo(credentials);
	}

	@Test
	public void test_requestSessionInfo_ReturnsResponseFromAllegroService() {

		final UserCredentials credentials = mock(UserCredentials.class);
		final SessionInfo expectedSessionInfo = mock(SessionInfo.class);
		when(service.createSessionInfo(any())).thenReturn(expectedSessionInfo);

		final SessionInfo actualSessionInfo = client.requestSessionInfo(credentials);

		assertEquals(expectedSessionInfo, actualSessionInfo);
	}

	@Test
	public void test_fetchAuctionContent_DelegatesToAllegroService() {

		final Long id = Long.valueOf(3);
		final UserCredentials credentials = mock(UserCredentials.class);
		final ItemInfo itemInfo = new ItemInfo();
		when(service.getItemInfo(eq(id), eq(credentials))).thenReturn(itemInfo);
		client.fetchAuctionContent(id, credentials);

		verify(service).getItemInfo(eq(id), eq(credentials));
	}

	@Test
	public void test_fetchAuctionContent_CopiesDataFromServiceInfoToResultingContent() {

		final Long auctionId = Long.valueOf(123);

		final ItemInfo itemInfo = new ItemInfo();
		itemInfo.setItBuyNowPrice(300f);
		itemInfo.setItPrice(12.32f);
		itemInfo.setItBuyNowActive(1);
		itemInfo.setItHighBidder(3);
		itemInfo.setItHitCount(7);
		itemInfo.setItId(auctionId);
		itemInfo.setItName("auction title");

		when(service.getItemInfo(eq(auctionId), any(UserCredentials.class))).thenReturn(itemInfo);

		final AuctionContent content = client.fetchAuctionContent(auctionId, mock(UserCredentials.class));

		assertTrue("BuyNowPrice NOT SET!", 0 == Float.compare(itemInfo.getItBuyNowPrice(), content.getItBuyNowPrice()));
		assertTrue("Price NOT SET!", 0 == Float.compare(itemInfo.getItPrice(), content.getItPrice()));
		assertEquals("Buy now active NOT SET!", itemInfo.getItBuyNowActive(), content.getItBuyNowActive());
		assertEquals("High bidder NOT SET!", itemInfo.getItHighBidder(), content.getItHighBidder());
		assertEquals("Hit count NOT SET!", itemInfo.getItHitCount(), content.getItHitCount());
		assertEquals("Auction Id NOT SET!", Long.valueOf(itemInfo.getItId()), content.getItId());
		assertEquals("Auction title NOT SET!", itemInfo.getItName(), content.getItName());

	}

	@Test
	public void test_fetchAuctionAvatar_DelegatesToAllegroService() {

		final long auctionId = 456L;
		final UserCredentials credentials = new UserCredentials();
		credentials.setUsername("testUserId");

		when(service.getItemInfo(eq(auctionId), eq(credentials))).thenReturn(new ItemInfo());

		client.fetchAuctionAvatar(auctionId, credentials);

		verify(service).getItemInfo(eq(auctionId), eq(credentials));
	}

	@Test
	public void test_fetchAuctionAvatar_CopiesItemInfoToResultingAvatar() {

		final UserCredentials credentials = new UserCredentials();
		credentials.setUsername("username");

		final ItemInfo itemInfo = new ItemInfo();
		itemInfo.setItName("test_auction_Name");

		final Long auctionId = Long.valueOf(123);
		itemInfo.setItId(auctionId);

		when(service.getItemInfo(eq(auctionId), eq(credentials))).thenReturn(itemInfo);

		final AuctionAvatar avatar = client.fetchAuctionAvatar(auctionId, credentials);

		assertTrue("Avatar Id NOT SET!", "" != avatar.getId()); // there_is_some_logic_behind_setting_Avatar_ID.
		assertTrue("Avatar Auction Id NOT SET!", auctionId.equals(avatar.getAuctionId()));
		assertEquals("Avatar Name NOT SET!", itemInfo.getItName(), avatar.getName());
		assertEquals("Avatar Username NOT SET!", credentials.getUsername(), avatar.getUsername());

	}
}
