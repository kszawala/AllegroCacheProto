package com.gft.kszawala.fasttrack.websocket.response;

import java.io.Serializable;

import com.gft.kszawala.fasttrack.model.AuctionAvatar;

/**
 * Web-socket response to be broadcast to those who subscribe for cache
 * notifications.
 */
public class Response implements Serializable {

	private static final long serialVersionUID = 6683828569510829137L;
	private final String msg;
	private final int cacheCount;
	private final Long auctionId;
	private final String username;

	public Response(final AuctionAvatar avatar, final String msg) {
		// It might be tempting to store Auction for more generic interface.
		// This is, however, expensive - consider,
		// the data is going to be transferred over HTTP to web browsers.

		this.msg = msg;
		this.cacheCount = avatar.getContents().size();
		this.auctionId = avatar.getAuctionId();
		this.username = avatar.getUsername();
	}

	public String getMsg() {

		return msg;
	}

	public Long getAuctionId() {

		return auctionId;
	}

	public int getCacheCount() {

		return cacheCount;
	}

	public String getUsername() {

		return username;
	}
}
