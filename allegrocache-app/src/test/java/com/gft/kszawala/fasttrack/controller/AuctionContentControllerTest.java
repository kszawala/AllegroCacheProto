package com.gft.kszawala.fasttrack.controller;

import static org.junit.Assert.assertSame;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.gft.kszawala.fasttrack.model.AuctionContent;
import com.gft.kszawala.fasttrack.model.dao.AuctionContentDao;

@RunWith(MockitoJUnitRunner.class)
public class AuctionContentControllerTest {

	@Mock
	AuctionContentDao dao;

	@InjectMocks
	AuctionContentController controller;

	@Test
	public void testHttpGETReturnsCacheEntriesYieldByDao() {

		final List<AuctionContent> expectedEntries = Arrays.asList(mock(AuctionContent.class),
				mock(AuctionContent.class), mock(AuctionContent.class));
		final String AUCTION_ID = "auction_id";

		when(dao.getAuctionContents(AUCTION_ID)).thenReturn(expectedEntries);

		assertSame(expectedEntries, controller.getContents(AUCTION_ID));
	}

	@SuppressWarnings("unchecked")
	@Test(expected = IllegalArgumentException.class)
	public void testHttpGETThrowsOnNonexistentAuctionId() {

		when(dao.getAuctionContents("invalid_auction_id")).thenThrow(IllegalArgumentException.class);
		controller.getContents("invalid_auction_id");
	}

	@Test
	public void testHttpDELETEPassesTheRequestOnDao() {

		final AuctionContent auctionContent = mock(AuctionContent.class);
		when(dao.getAuctionContent("cache_id")).thenReturn(auctionContent);

		controller.deleteContentEntry("cache_id");

		verify(dao).remove(auctionContent);
	}

	@Test
	public void testHttpDELETEReturnsRemainingCacheEntries() {

		final AuctionContent auctionContent = mock(AuctionContent.class);
		final String AUCTION_ID = "auction_id";
		when(auctionContent.getFk()).thenReturn(AUCTION_ID);
		when(dao.getAuctionContent(anyString())).thenReturn(auctionContent);

		controller.deleteContentEntry(anyString());

		verify(dao).getAuctionContents(AUCTION_ID);
	}

}
