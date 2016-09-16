package com.gft.kszawala.fasttrack;

import org.h2.server.web.WebServlet;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.gft.kszawala.fasttrack.properties.AllegroProperties;

@SpringBootApplication

// EnableJms + EnableScheduling = sending jms from web-socket end point to JSP.
@EnableJms
@EnableScheduling
@EnableConfigurationProperties(AllegroProperties.class)
public class AllegroCacheProtoApplication {

	public static void main(final String[] args) {

		SpringApplication.run(AllegroCacheProtoApplication.class, args);
	}

	// http://stackoverflow.com/questions/24655684/spring-boot-default-h2-jdbc-connection-and-h2-console
	@Bean
	public ServletRegistrationBean h2servletRegistration() {

		final ServletRegistrationBean registration = new ServletRegistrationBean(new WebServlet());
		registration.addUrlMappings("/console/*");
		return registration;
	}
}
