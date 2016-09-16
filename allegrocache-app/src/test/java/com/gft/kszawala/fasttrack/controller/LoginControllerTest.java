package com.gft.kszawala.fasttrack.controller;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.ui.ExtendedModelMap;
import org.springframework.ui.Model;

import com.gft.kszawala.fasttrack.allegro.client.AllegroClient;
import com.gft.kszawala.fasttrack.model.UserCredentials;
import com.gft.kszawala.fasttrack.model.dao.UserCredentialsDao;

@RunWith(MockitoJUnitRunner.class)
public class LoginControllerTest {

	@Mock
	private AllegroClient allegroClient;

	@Mock
	private UserCredentialsDao credentialsDao;

	@InjectMocks
	private LoginController controller;

	@Test
	public void testHttpGETRredirectsToLoginPage() {

		assertEquals("login", controller.promptLogin(mock(Model.class)));
	}

	@Test
	public void testHttpGETResetsCredentials() {

		final Model model = new ExtendedModelMap();

		controller.promptLogin(model);

		final UserCredentials credentials = (UserCredentials) model.asMap().get("userCredentials");
		final String username = credentials.getUsername();
		final String password = credentials.getPassword();
		final String apiKey = credentials.getWebApiKey();

		assertTrue("Username is not reset!", username.isEmpty());
		assertTrue("Password is not reset!", password.isEmpty());
		assertTrue("API Key is not reset!", apiKey.isEmpty());
	}

	@Test
	public void testHttpGETResetsErrorMessage() {

		// Error message is a model attribute to hold user message.
		final ExtendedModelMap model = new ExtendedModelMap();

		controller.promptLogin(model);

		final String errorMsg = (String) model.asMap().get("loginErrorMsg");

		assertTrue(errorMsg.isEmpty());
	}

	@SuppressWarnings("unchecked")
	@Test
	public void testHttpPOSTSetsErrorMessageWhenAllegroClientThrows() {

		when(allegroClient.requestSessionInfo(any())).thenThrow(Exception.class);

		final ExtendedModelMap model = new ExtendedModelMap();
		final UserCredentials credentials = new UserCredentials();
		credentials.setUsername("username");
		credentials.setPassword("pass");
		credentials.setWebApiKey("webkey");

		controller.attemptToLogin(credentials, model);

		final String errorMsg = model.asMap().get("loginErrorMsg").toString();

		assertFalse(errorMsg.isEmpty());
	}

	@Test
	public void testHttpPOSTSetsErrorMessageWhenCredentialsDaoThrows() {

		doThrow(Exception.class).when(credentialsDao).add(any());

		final ExtendedModelMap model = new ExtendedModelMap();
		final UserCredentials credentials = new UserCredentials();
		credentials.setUsername("username");
		credentials.setPassword("pass");
		credentials.setWebApiKey("webkey");

		controller.attemptToLogin(credentials, model);

		final String errorMsg = model.asMap().get("loginErrorMsg").toString();

		assertFalse(errorMsg.isEmpty());
	}

	@Test
	public void testHttpPOSTReturnsRedirectToAuctionsViewOnSuccessfulLogin() {

		// Successful login == no exceptions throws by neither allegroClient nor
		// credentialsDao.
		assertEquals("redirect:auctions", controller.attemptToLogin(mock(UserCredentials.class), mock(Model.class)));
	}
}
