package com.gft.kszawala.fasttrack.model.dao;

import java.util.List;

import javax.annotation.Resource;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.AuctionContent;

@Resource
@Transactional
public class AuctionContentDao {

	@PersistenceContext
	private EntityManager em;

	public List<AuctionContent> getAuctionContents(final String auctionId) {

		final AuctionAvatar avatar = em.find(AuctionAvatar.class, auctionId);
		if (avatar != null) {

			return avatar.getContents();
		}

		throw new IllegalArgumentException("Invalid ID!");
	}

	public AuctionContent getAuctionContent(final String cacheId) {

		return em.find(AuctionContent.class, cacheId);
	}

	public void remove(final AuctionContent content) {

		em.remove(content);
	}

	/**
	 *
	 * @param content
	 * @param avatar
	 */
	public void add(final AuctionContent content, final AuctionAvatar avatar) {

		content.setFk(avatar.getAuctionId() + avatar.getUsername());
		em.persist(content);
	}
}
