package com.gft.kszawala.fasttrack.allegro.client;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.client.core.WebServiceTemplate;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;

import com.gft.kszawala.fasttrack.allegro.client.generatedclasses.ArrayOfLong;
import com.gft.kszawala.fasttrack.allegro.client.generatedclasses.ArrayOfSysstatustype;
import com.gft.kszawala.fasttrack.allegro.client.generatedclasses.DoGetItemsInfoRequest;
import com.gft.kszawala.fasttrack.allegro.client.generatedclasses.DoGetItemsInfoResponse;
import com.gft.kszawala.fasttrack.allegro.client.generatedclasses.DoLoginRequest;
import com.gft.kszawala.fasttrack.allegro.client.generatedclasses.DoLoginResponse;
import com.gft.kszawala.fasttrack.allegro.client.generatedclasses.DoQueryAllSysStatusRequest;
import com.gft.kszawala.fasttrack.allegro.client.generatedclasses.DoQueryAllSysStatusResponse;
import com.gft.kszawala.fasttrack.allegro.client.generatedclasses.ItemInfo;
import com.gft.kszawala.fasttrack.allegro.client.generatedclasses.ItemInfoStruct;
import com.gft.kszawala.fasttrack.allegro.client.generatedclasses.SysStatusType;
import com.gft.kszawala.fasttrack.model.SessionInfo;
import com.gft.kszawala.fasttrack.model.UserCredentials;
import com.gft.kszawala.fasttrack.properties.AllegroProperties;

/**
 * Allegro SOAP client service. Encapsulates interaction with the WebApi soap
 * web-services.
 *
 * @injects AllegroProperties for accessing "allegro*" configuration props.
 *
 * @author kfsw
 *
 */
public class AllegroSoapServiceImpl extends WebServiceGatewaySupport implements AllegroService {

	@Autowired
	AllegroProperties allegroProps;

	@Override
	public ItemInfo getItemInfo(final Long auctionId, final UserCredentials credentials) {

		final DoGetItemsInfoResponse response = getAuctionDetails(credentials, Arrays.asList(auctionId),
				getDoGetItemsInfoUrl());

		final List<ItemInfoStruct> items = response.getArrayItemListInfo().getItem();
		if (items.isEmpty()) {
			throw new IllegalArgumentException("Failed to fetch details of auction id = " + auctionId);
		}

		return items.get(0).getItemInfo();
	}

	@Override
	public SessionInfo createSessionInfo(final UserCredentials credentials) {

		final long verKey = requestVersionKey(credentials);

		final DoLoginResponse responseLogin = logIn(credentials, verKey);

		final String sessionHandle = responseLogin.getSessionHandlePart();
		logger.info("creting session info with id: " + sessionHandle);
		final SessionInfo sessionInfo = new SessionInfo();
		sessionInfo.setSessionHandle(sessionHandle);
		sessionInfo.setModified(new Date());
		return sessionInfo;
	}

	// ----------------- HELPER METHODS

	private DoGetItemsInfoResponse getAuctionDetails(final UserCredentials credentials, final List<Long> auctionIds,
			final String url) {

		final DoGetItemsInfoRequest request = new DoGetItemsInfoRequest();

		// @see
		// http://allegro.pl/webapi/documentation.php/show/id,52#method-input
		final ArrayOfLong auctionIdArray = new ArrayOfLong();
		auctionIdArray.getItem().addAll(auctionIds);
		request.setItemsIdArray(auctionIdArray);
		request.setSessionHandle(credentials.getSessionInfo().getSessionHandle());
		request.setGetDesc(1);// include auction description in the response

		// log
		final List<Long> ids = auctionIdArray.getItem();
		ids.forEach(i -> logger.debug("Requesting auctions for id" + i));

		// invoke SOAP
		final WebServiceTemplate webServiceTemplate = getWebServiceTemplate();
		final DoGetItemsInfoResponse response = (DoGetItemsInfoResponse) webServiceTemplate.marshalSendAndReceive(url,
				request);

		return response;
	}

	private DoLoginResponse logIn(final UserCredentials credentials, final long versionKey) {

		final String url = getDoLoginUrl();
		final int countryCode = allegroProps.getCountryCode();
		final DoLoginRequest request = new DoLoginRequest();

		request.setUserLogin(credentials.getUsername());
		request.setUserPassword(credentials.getPassword());

		request.setCountryCode(countryCode);
		request.setWebapiKey(credentials.getWebApiKey());
		request.setLocalVersion(versionKey);

		logger.info("Invoking SOAP WS to login user: " + credentials.getUsername());

		final DoLoginResponse response = (DoLoginResponse) getWebServiceTemplate().marshalSendAndReceive(url, request);

		return response;
	}

	private DoQueryAllSysStatusResponse getVersionKey(final int countryId, final UserCredentials credentials,
			final String url) {

		final DoQueryAllSysStatusRequest request = new DoQueryAllSysStatusRequest();

		request.setCountryId(countryId);
		request.setWebapiKey(credentials.getWebApiKey());

		logger.debug("Requesting version key for " + request.getWebapiKey());

		final DoQueryAllSysStatusResponse response = (DoQueryAllSysStatusResponse) getWebServiceTemplate()
				.marshalSendAndReceive(url, request);

		return response;
	}

	private long requestVersionKey(final UserCredentials credentials) {

		logger.info("attempt to get version key");
		final int countryId = allegroProps.getCountryCode();
		final DoQueryAllSysStatusResponse responseWebKey = getVersionKey(countryId, credentials,
				getDoQueryAllSysStatusUrl());
		final ArrayOfSysstatustype statusArray = responseWebKey.getSysCountryStatus();

		final Stream<SysStatusType> statuses = statusArray.getItem().stream();
		final SysStatusType status = statuses.filter(s -> (s.getCountryId() == countryId)).findFirst().get();
		final long verKey = status.getVerKey();
		return verKey;
	}

	private String getDoQueryAllSysStatusUrl() {

		return getAllegroUrl(allegroProps.getDoQueryAllSysStatus());
	}

	private String getDoGetItemsInfoUrl() {

		return getAllegroUrl(allegroProps.getDoGetItemsInfo());
	}

	private String getDoLoginUrl() {

		return getAllegroUrl(allegroProps.getDoLogin());
	}

	private String getAllegroUrl(final String methodName) {

		return allegroProps.getWsdl() + "/" + methodName;
	}
}
