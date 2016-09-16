package com.gft.kszawala.fasttrack.model.dao;

import java.util.List;

import javax.annotation.Resource;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

import com.gft.kszawala.fasttrack.model.UserCredentials;

@Resource
@Transactional
public class UserCredentialsDao {

	@PersistenceContext
	private EntityManager em;

	public List<UserCredentials> getAll() {

		final TypedQuery<UserCredentials> query = em.createNamedQuery(UserCredentials.ALL, UserCredentials.class);

		return query.getResultList();
	}

	@Transactional(Transactional.TxType.REQUIRES_NEW)
	public void add(final UserCredentials credentials) {

		em.merge(credentials);
	}
}
