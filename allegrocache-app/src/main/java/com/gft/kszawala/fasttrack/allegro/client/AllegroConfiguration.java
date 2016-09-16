
package com.gft.kszawala.fasttrack.allegro.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;

import com.gft.kszawala.fasttrack.allegro.client.mock.AllegroClientMock;
import com.gft.kszawala.fasttrack.properties.AllegroProperties;

@Configuration
public class AllegroConfiguration {

	@Autowired
	AllegroProperties allegroProps;

	@Bean
	public Jaxb2Marshaller marshaller() {

		final Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
		marshaller.setContextPath(allegroProps.getGeneratedClassesPackage());

		return marshaller;
	}

	@Bean
	public AllegroClient allegroClientProd() {

		return new AllegroClientImpl();
	}

	@Bean
	public AllegroService createAllegroService(final Jaxb2Marshaller marshaller) {

		final AllegroSoapServiceImpl service = new AllegroSoapServiceImpl();
		service.setDefaultUri(allegroProps.getWsdl());
		service.setMarshaller(marshaller);
		service.setUnmarshaller(marshaller);

		return service;
	}

	@Profile("test")
	@Primary
	@Bean
	public AllegroClient allegroClientMock(final Jaxb2Marshaller marshaller) {

		return new AllegroClientMock();
	}
}