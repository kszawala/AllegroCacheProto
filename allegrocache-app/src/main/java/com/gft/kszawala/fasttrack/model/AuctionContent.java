package com.gft.kszawala.fasttrack.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * Domain Model class. Encapsulates a subset of pieces of data describing
 * Allegro Auction @see
 * com.gft.kszawala.fasttrack.allegro.client.generatedclasses.ItemInfo. The
 * particular attributes have been selected arbitrarily.
 *
 * @author kfsw
 *
 */
@Entity
public class AuctionContent {

	// it** naming convention consistent with Allegro API.
	// @see http://allegro.pl/webapi/documentation.php/show/id,52#method-output
	@Id
	@GeneratedValue
	private String cacheId;

	private String fk;

	@ManyToOne(optional = false)
	@JoinColumn(name = "fk", referencedColumnName = "id", insertable = false, updatable = false) // ,
																									// nullable
																									// =
																									// false)
	private AuctionAvatar avatar;

	private long timestamp; // does not come from Allegro. Set at insert time by
							// the caching logic.

	private Long itId;
	private String itName;
	private float itPrice;
	private float itBuyNowPrice;
	private int itBidCount;
	private int itBuyNowActive;
	private int itHighBidder;
	private long itHitCount;

	public String getCacheId() {

		return cacheId;
	}

	public String getFk() {

		return fk;
	}

	public void setFk(final String fk) {

		this.fk = fk;
	}

	public long getTimestamp() {

		return timestamp;
	}

	public void setTimestamp(final long timestamp) {

		this.timestamp = timestamp;
	}

	public Long getItId() {

		return itId;
	}

	public void setItId(final Long itId) {

		this.itId = itId;
	}

	public String getItName() {

		return itName;
	}

	public void setItName(final String itName) {

		this.itName = itName;
	}

	public float getItPrice() {

		return itPrice;
	}

	public void setItPrice(final float itPrice) {

		this.itPrice = itPrice;
	}

	public float getItBuyNowPrice() {

		return itBuyNowPrice;
	}

	public void setItBuyNowPrice(final float itBuyNowPrice) {

		this.itBuyNowPrice = itBuyNowPrice;
	}

	public int getItBidCount() {

		return itBidCount;
	}

	public void setItBidCount(final int itBidCount) {

		this.itBidCount = itBidCount;
	}

	public int getItBuyNowActive() {

		return itBuyNowActive;
	}

	public void setItBuyNowActive(final int itBuyNowActive) {

		this.itBuyNowActive = itBuyNowActive;
	}

	public int getItHighBidder() {

		return itHighBidder;
	}

	public void setItHighBidder(final int itHighBidder) {

		this.itHighBidder = itHighBidder;
	}

	public long getItHitCount() {

		return itHitCount;
	}

	public void setItHitCount(final long itHitCount) {

		this.itHitCount = itHitCount;
	}

}
