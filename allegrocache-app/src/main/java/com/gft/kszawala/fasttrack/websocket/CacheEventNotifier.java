package com.gft.kszawala.fasttrack.websocket;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import com.gft.kszawala.fasttrack.websocket.response.Response;

@Service
public class CacheEventNotifier {

	@Autowired
	private SimpMessageSendingOperations messagingTemplate;

	private static final Log logger = LogFactory.getLog(CacheEventNotifier.class);

	public void broadcast(final Response response) {

		logger.info(String.format("about to send a message from a scheduled task: '%s'", response.getMsg()));

		messagingTemplate.convertAndSend("/topic/cacheOutdated", response);
	}
}
