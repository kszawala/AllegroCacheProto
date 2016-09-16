package com.gft.kszawala.fasttrack.controller;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.ui.ExtendedModelMap;
import org.springframework.ui.Model;

import com.gft.kszawala.fasttrack.allegro.client.AllegroClient;
import com.gft.kszawala.fasttrack.model.AuctionAvatar;
import com.gft.kszawala.fasttrack.model.AuctionIdentifier;
import com.gft.kszawala.fasttrack.model.UserCredentials;
import com.gft.kszawala.fasttrack.model.dao.AuctionAvatarDao;
import com.gft.kszawala.fasttrack.properties.AllegroProperties;

@RunWith(MockitoJUnitRunner.class)
public class AuctionAvatarControllerTest {

	@Mock
	private AuctionAvatarDao avatarDao;
	@Mock
	private AllegroClient allegroClient;
	@Mock
	private AllegroProperties properties;

	@InjectMocks
	AuctionAvatarController controller;

	@Test
	public void testdisplayAvatarList_ResetsAuctionModelAttribute() {

		final Model model = new ExtendedModelMap();

		controller.displayAvatarList(mock(UserCredentials.class), model);

		final AuctionAvatar avatar = (AuctionAvatar) model.asMap().get("auction");
		assertEquals(null, avatar.getAuctionId());
		assertEquals(null, avatar.getName());
		assertEquals(null, avatar.getUsername());
		assertEquals(null, avatar.getId());
	}

	@Test
	public void testdisplayAvatarList_SetsUserAuctionAvatars() {

		final Model model = new ExtendedModelMap();
		final List<AuctionAvatar> userAvatars = Arrays.asList(mock(AuctionAvatar.class), mock(AuctionAvatar.class));
		when(avatarDao.getUserAvatars(any())).thenReturn(userAvatars);

		controller.displayAvatarList(mock(UserCredentials.class), model);

		assertSame(userAvatars, (model.asMap().get("auctions")));
	}

	@Test
	public void testdisplayAvatarList_SetsAllegroHomeToConfiguredURL() {

		final Model model = new ExtendedModelMap();
		final String allegroHome = "http://ConfiguredAllegroHome.pl";
		when(properties.getHome()).thenReturn(allegroHome);

		controller.displayAvatarList(mock(UserCredentials.class), model);

		assertEquals(allegroHome, model.asMap().get("allegroHome"));
	}

	@Test
	public void testdisplayAvatarList_ResetsAuctionIdentifier() {

		final ExtendedModelMap model = new ExtendedModelMap();

		controller.displayAvatarList(mock(UserCredentials.class), model);

		final AuctionIdentifier auctionIdentifier = (AuctionIdentifier) model.asMap().get("auctionIdentifier");
		assertEquals(null, auctionIdentifier.getAuctionId());
	}

	@Test
	public void testdisplayAvatarList_ReturnsViewName() {

		final String viewName = controller.displayAvatarList(mock(UserCredentials.class), mock(Model.class));

		assertEquals("auctions", viewName);
	}

	@Test
	public void testaddAvatar_ReturnsViewName() {

		final String viewName = controller.addAvatar(mock(UserCredentials.class), mock(AuctionIdentifier.class),
				mock(Model.class));

		assertEquals("redirect:auctions", viewName);
	}

	@Test
	public void testaddAvatar_RequestsAvatarFromAllegroClient() {

		final Long id = Long.valueOf(123);
		final AuctionIdentifier auctionIdentifier = new AuctionIdentifier();
		auctionIdentifier.setAuctionId(id);

		controller.addAvatar(mock(UserCredentials.class), auctionIdentifier, mock(Model.class));

		verify(allegroClient).fetchAuctionAvatar(eq(id), any());
	}

	@Test
	public void testaddAvatar_AvatarIsPersistedWithDao() {

		controller.addAvatar(mock(UserCredentials.class), mock(AuctionIdentifier.class), mock(Model.class));

		verify(avatarDao).add(any());
	}

	@Test
	public void testaddAvatar_PersistingWithDaoHappensAfterFetchingFromAllegro() {

		final InOrder inOrder = inOrder(allegroClient, avatarDao);

		controller.addAvatar(mock(UserCredentials.class), mock(AuctionIdentifier.class), mock(Model.class));

		inOrder.verify(allegroClient).fetchAuctionAvatar(any(), any());
		inOrder.verify(avatarDao).add(any());
	}

	@Test
	public void testdeleteAvatar_ReturnsViewName() {

		final String viewName = controller.deleteAvatar(mock(UserCredentials.class), "avatarId", mock(Model.class));

		assertEquals("redirect:/auctions", viewName);
	}

	@Test
	public void testdeleteAvatar_RemovesWithDao() {

		controller.deleteAvatar(mock(UserCredentials.class), "avatar_id", mock(Model.class));

		verify(avatarDao).remove(anyString());
	}
}
