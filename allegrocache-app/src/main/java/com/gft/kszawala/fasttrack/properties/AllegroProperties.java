package com.gft.kszawala.fasttrack.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "allegro")
public class AllegroProperties {

	private String home;
	private String wsdl;
	private String doLogin;
	private String doGetItemsInfo;
	private String doQueryAllSysStatus;

	private String generatedClassesPackage;
	private int countryCode;

	public String getGeneratedClassesPackage() {

		return generatedClassesPackage;
	}

	public String getHome() {

		return home;
	}

	public void setHome(final String home) {

		this.home = home;
	}

	public String getWsdl() {

		return wsdl;
	}

	public String getDoLogin() {

		return doLogin;
	}

	public void setDoLogin(final String doLogin) {

		this.doLogin = doLogin;
	}

	public String getDoGetItemsInfo() {

		return doGetItemsInfo;
	}

	public void setDoGetItemsInfo(final String doGetItemsInfo) {

		this.doGetItemsInfo = doGetItemsInfo;
	}

	public String getDoQueryAllSysStatus() {

		return doQueryAllSysStatus;
	}

	public void setDoQueryAllSysStatus(final String doQueryAllSysStatus) {

		this.doQueryAllSysStatus = doQueryAllSysStatus;
	}

	public void setGeneratedClassesPackage(final String generatedClassesPackage) {

		this.generatedClassesPackage = generatedClassesPackage;
	}

	public void setWsdl(final String wsdl) {

		this.wsdl = wsdl;
	}

	public int getCountryCode() {

		return countryCode;
	}

	public void setCountryCode(final int countryCode) {

		this.countryCode = countryCode;
	}
}
