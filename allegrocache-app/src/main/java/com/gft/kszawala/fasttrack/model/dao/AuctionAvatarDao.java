package com.gft.kszawala.fasttrack.model.dao;

import java.util.List;

import javax.annotation.Resource;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import com.gft.kszawala.fasttrack.model.AuctionAvatar;

@Resource
@Transactional
public class AuctionAvatarDao {

	@PersistenceContext
	private EntityManager em;

	public List<AuctionAvatar> getUserAvatars(final String username) {

		final TypedQuery<AuctionAvatar> avatarQuery = em.createNamedQuery(AuctionAvatar.PER_USER, AuctionAvatar.class);
		avatarQuery.setParameter("username", username);

		return avatarQuery.getResultList();
	}

	@Transactional(TxType.REQUIRES_NEW)
	public void remove(final String id) {

		final AuctionAvatar a = em.find(AuctionAvatar.class, id);
		em.remove(a);
	}

	@Transactional(TxType.REQUIRES_NEW)
	public void add(final AuctionAvatar auction) {

		em.persist(auction);
	}
}
