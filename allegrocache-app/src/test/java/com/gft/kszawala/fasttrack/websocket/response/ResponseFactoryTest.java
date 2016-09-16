package com.gft.kszawala.fasttrack.websocket.response;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.gft.kszawala.fasttrack.model.AuctionAvatar;

public class ResponseFactoryTest {

	@Test
	public void testMessageIsPassed() {

		final AuctionAvatar avatar = new AuctionAvatar();
		final String MSG = "broadcast msg";

		final Response response = new ResponseFactory().create(avatar, MSG);

		assertEquals(MSG, response.getMsg());
	}

	@Test
	public void testAuctionIsPassed() {
		// 'username' is an arbitrary chosen field that,
		// according to Response interface is set based on the given Auction.

		final AuctionAvatar avatar = new AuctionAvatar();
		avatar.setUsername("kszawala");
		assertEquals("kszawala", new ResponseFactory().create(avatar, "a msg").getUsername());
	}
}
