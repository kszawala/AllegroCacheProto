package com.gft.kszawala.fasttrack.controller;

import java.util.List;

import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.gft.kszawala.fasttrack.model.AuctionContent;
import com.gft.kszawala.fasttrack.model.dao.AuctionContentDao;

@RestController
@Transactional
/**
 * A class in charge of REST requests for Auction Content (aka Cache Entries).
 *
 * @injects AuctionContentDao to interact with Auction Cache DB.
 *
 * @author kfsw
 *
 */
public class AuctionContentController {

	private static final Log logger = LogFactory.getLog(AuctionContentController.class);

	@Autowired
	private AuctionContentDao contentDao;

	/**
	 * @param id
	 *            - auction id.
	 * @return all cache entries for the given auction id.
	 * @throws IllegalArgumentException
	 *             if the given id refers to a nonexistent Auction.
	 */
	@RequestMapping(path = "/auctions/{id}", method = RequestMethod.GET)
	public List<AuctionContent> getContents(@PathVariable final String id) {

		logger.info("retrieving contents from REST controller for auction id = " + id);

		return contentDao.getAuctionContents(id);
	}

	/**
	 * Delete cache entry by its id.
	 *
	 * @param cacheId
	 *            - id of the cache entry to delete
	 * @return list of remaining (after delete) cache entries for the Auction
	 *         (identified by FK of the deleted cache entry).
	 */
	@RequestMapping(path = "/caches/{cacheId}", method = RequestMethod.DELETE)
	public List<AuctionContent> deleteContentEntry(@PathVariable final String cacheId) {

		logger.info("deleting content entry, Id = " + cacheId);

		final AuctionContent contentEntryToDel = contentDao.getAuctionContent(cacheId);

		contentDao.remove(contentEntryToDel);

		return getContents(contentEntryToDel.getFk()); // TODO: is a
		// nested call
		// of
		// REST handle
		// method legal?
	}
}
