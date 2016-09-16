package com.gft.kszawala.fasttrack.allegro.cache;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.gft.kszawala.fasttrack.allegro.client.AllegroClient;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.UserCredentials;
import com.gft.kszawala.fasttrack.model.dao.AuctionAvatarDao;
import com.gft.kszawala.fasttrack.model.dao.AuctionContentDao;
import com.gft.kszawala.fasttrack.model.dao.UserCredentialsDao;

@Component
@Scope("prototype")
/**
 * @injects AuctionAvatarDao for db operations on Auction Avatars.
 * @injects AuctionContentDao for db operations on Auction Content.
 * @injects UserCredentialsDao for db operations on UserCredentials.
 * @injects AllegroClient for interaction with Allegro Web API.
 * @injects CacheUpdaterFactory to create new instances of CacheUpdater.
 *
 * @author kfsw
 *
 */
public class CacheUpdaterSetFactoryImpl implements CacheUpdaterSetFactory {

	@Autowired
	private AuctionAvatarDao avatarDao;

	@Autowired
	private AuctionContentDao contentDao;

	@Autowired
	private UserCredentialsDao credentialsDao;

	@Autowired
	private AllegroClient allegroClient;

	@Autowired
	private CacheUpdaterFactory factory;

	private static final Log logger = LogFactory.getLog(CacheUpdaterSetFactoryImpl.class);

	@Override
	/**
	 * {@inheritDoc}
	 */
	public Set<CacheUpdater> create() {

		logger.info("about to create cache udpaters...");

		// collection of updater objects - 1 updater per user per auction
		// (auction X observed by users K and P result in two updaters)
		final Set<CacheUpdater> cacheUpdaters = new HashSet<CacheUpdater>();

		// users who observe auctions (some auctions can be observed by
		// many users).
		getAuctionObservers().forEach(uc -> {
			final List<AuctionAvatar> avatars = avatarDao.getUserAvatars(uc.getUsername());

			avatars.forEach(a -> {
				final CacheUpdater updater = factory.create(a, contentDao, allegroClient, uc);
				cacheUpdaters.add(updater);
				logger.info("created updater for auction id = " + a.getAuctionId());
			});
		});

		logger.info("cache udpaters created");

		return cacheUpdaters;
	}

	private List<UserCredentials> getAuctionObservers() {

		return credentialsDao.getAll();
	}
}
