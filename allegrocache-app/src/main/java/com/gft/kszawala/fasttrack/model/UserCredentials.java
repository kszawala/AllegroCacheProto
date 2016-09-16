package com.gft.kszawala.fasttrack.model;

import java.util.LinkedList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Transient;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@NamedQuery(name = UserCredentials.ALL, query = "SELECT uc FROM UserCredentials uc")
public class UserCredentials {

	public final static String ALL = "UserCredentials.ALL";

	@NotEmpty
	@Id
	private String username;

	@Transient
	private String password;
	@NotEmpty
	private String webApiKey;

	@OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private SessionInfo sessionInfo;

	@OneToMany(mappedBy = "credentials")
	private List<AuctionAvatar> avatars = new LinkedList<AuctionAvatar>();

	public String getPassword() {

		return password;
	}

	public String getUsername() {

		return username;
	}

	public String getWebApiKey() {

		return webApiKey;
	}

	public void setPassword(final String password) {

		this.password = password;
	}

	public void setUsername(final String username) {

		this.username = username;
	}

	public void setWebApiKey(final String webApiKey) {

		this.webApiKey = webApiKey;
	}

	public SessionInfo getSessionInfo() {

		return sessionInfo;
	}

	public void setSessionInfo(final SessionInfo sessionInfo) {

		this.sessionInfo = sessionInfo;
	}

	public List<AuctionAvatar> getAvatars() {

		return avatars;
	}
}