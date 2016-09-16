package com.gft.kszawala.fasttrack.model.dao;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DaoConfiguration {

	@Bean
	public AuctionAvatarDao createAvatarDao() {

		return new AuctionAvatarDao();
	}

	@Bean
	public AuctionContentDao createContentDao() {

		return new AuctionContentDao();
	}

	@Bean
	public UserCredentialsDao createUserCredentialsDao() {

		return new UserCredentialsDao();
	}
}
