package com.gft.kszawala.fasttrack.model;

import java.util.LinkedList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;

@Entity
@NamedQuery(name = AuctionAvatar.PER_USER, query = "SELECT a FROM AuctionAvatar a WHERE a.username=:username")
public class AuctionAvatar {

	public final static String PER_USER = "AuctionAvatar.PER_USER";

	@Id
	private String id;
	private String username;
	private Long auctionId;
	private String name;

	@OneToMany(mappedBy = "avatar", cascade = { CascadeType.REMOVE, CascadeType.PERSIST })
	private List<AuctionContent> contents = new LinkedList<>();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "username", insertable = false, updatable = false)
	private UserCredentials credentials;

	public String getId() {

		return id;
	}

	public void setId(final Long id, final String username) {

		this.id = id + username;
	}

	public String getUsername() {

		return username;
	}

	public void setUsername(final String username) {

		this.username = username;
	}

	public Long getAuctionId() {

		return auctionId;
	}

	public void setAuctionId(final Long auctionId) {

		this.auctionId = auctionId;
	}

	public String getName() {

		return name;
	}

	public void setName(final String name) {

		this.name = name;
	}

	public List<AuctionContent> getContents() {

		return contents;
	}

	public boolean isCacheFull() {

		return getContents().size() >= 5; // TODO can this be configurable?
	}
}
