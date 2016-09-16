package com.gft.kszawala.fasttrack.websocket.response;

import com.gft.kszawala.fasttrack.model.AuctionAvatar;

/**
 * Factory for Response objects.
 *
 * @author kfsw
 *
 */
public class ResponseFactory {

	/**
	 * @param avatar
	 *            - auction for the response.
	 * @param broadcastMsg
	 *            - message for the response.
	 * @return new instance of Response. @see
	 *         com.gft.kszawala.fasttract.websocket.response.Response.
	 */
	public Response create(final AuctionAvatar avatar, final String broadcastMsg) {

		return new Response(avatar, broadcastMsg);
	}
}
