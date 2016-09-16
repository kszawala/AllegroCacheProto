package com.gft.kszawala.fasttrack.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
public class SessionInfo {

	@Id
	private String sessionHandle;
	@Temporal(TemporalType.TIMESTAMP)
	private Date modified;

	public String getSessionHandle() {

		return sessionHandle;
	}

	public void setSessionHandle(final String sessionHandle) {

		this.sessionHandle = sessionHandle;
	}

	public Date getModified() {

		return modified;
	}

	public void setModified(final Date modified) {

		this.modified = modified;
	}
}
