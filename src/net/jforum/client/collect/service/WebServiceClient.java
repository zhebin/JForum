package net.jforum.client.collect.service;

import java.net.MalformedURLException;
import java.net.URL;

import org.apache.log4j.Logger;
import org.codehaus.xfire.client.Client;

public class WebServiceClient {
	private Logger log = Logger.getLogger(WebServiceClient.class);
	public String insertInfo(String infoXML,String serviceURL)throws Exception{
		String result=null;
    	try {
    		URL urls = new URL(serviceURL);
    		Client client = new Client(urls);
    		Object []ob = client.invoke("insertInfo", new Object[]{infoXML});
			result = ob[0].toString();
		} catch (MalformedURLException e) {
			log.error("添加内容为"+infoXML+"的关注信息失败");
			log.error("webservice新增关注信息失败，失败原因："+e.getMessage(),e);
		}
    	return result;
	}
}
