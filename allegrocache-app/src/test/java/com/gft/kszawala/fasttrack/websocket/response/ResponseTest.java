package com.gft.kszawala.fasttrack.websocket.response;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

import java.util.Arrays;

import org.junit.Test;

import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.AuctionContent;

public class ResponseTest {

	@Test
	public void testResponseSetsCacheCount() {

		final AuctionAvatar avatar = new AuctionAvatar();
		avatar.getContents().addAll(
				Arrays.asList(mock(AuctionContent.class), mock(AuctionContent.class), mock(AuctionContent.class)));

		final Response response = new Response(avatar, "msg text");

		assertEquals(avatar.getContents().size(), response.getCacheCount());
	}

	@Test
	public void testResponseSetsUsername() {

		final String USERNAME = "kszawala";
		final AuctionAvatar avatar = new AuctionAvatar();
		avatar.setUsername(USERNAME);

		final Response response = new Response(avatar, "some msg");

		assertEquals(USERNAME, response.getUsername());
	}

	@Test
	public void testResponseSetsId() {

		final AuctionAvatar avatar = new AuctionAvatar();
		avatar.setAuctionId(123L);
		final Response response = new Response(avatar, "a msg");

		assertEquals(Long.valueOf(123), response.getAuctionId());
	}

	@Test
	public void testResponseSetsMessage() {

		final String MSG = "message to be broadcast";

		final Response response = new Response(new AuctionAvatar(), MSG);

		assertEquals(MSG, response.getMsg());
	}
}
