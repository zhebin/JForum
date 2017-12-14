package net.jforum.client.collect.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.jforum.client.collect.service.WebServiceClient;
import net.jforum.util.DateUtils;
import net.jforum.util.preferences.ConfigKeys;
import net.jforum.util.preferences.SystemGlobals;

import org.apache.log4j.Logger;


public class CollectAction extends HttpServlet{

	private static final long serialVersionUID = 1L;
	private static Logger log = Logger.getLogger(CollectAction.class);
	private static String serviceURL = SystemGlobals.getValue(ConfigKeys.JFORUM_CARE_WEBSERVICE_URL);
	private static String servername = SystemGlobals.getValue(ConfigKeys.JFORUM_ACCESS_SERVER);
	

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		this.doGet(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		try {
			String userId = (String) req.getParameter("uid");;
			String title = (String) req.getParameter("title");
			String url = (String) req.getParameter("url");
			title = URLDecoder.decode(title, "UTF-8");
			boolean b = false;
			if(userId != null && !"".equals(userId)){
				String timestr = DateUtils.getCurrDateTimeStr();
				String infoXML="";
				StringBuffer sb = new StringBuffer();
				sb.append("<datas>");
				sb.append("<data>");
				sb.append("<portalUid><![CDATA["+userId+"]]></portalUid>");
				sb.append("<title><![CDATA["+title+"]]></title>");
				sb.append("<url><![CDATA["+servername+url+"]]></url>");
				sb.append("<time><![CDATA["+timestr+"]]></time>");
				sb.append("<moduleName><![CDATA[热点论坛]]></moduleName>");
				sb.append("<args1></args1>");
				sb.append("<args2></args2>");
				sb.append("<args3></args3>");
				sb.append("</data>");
				sb.append("</datas>");
				PrintWriter out = resp.getWriter();
				resp.setContentType("text/html;charset=utf-8");
				infoXML = sb.toString();
				WebServiceClient client = new WebServiceClient();
				String res = client.insertInfo(infoXML, serviceURL);
				if("1".equals(res)){
					b = true;
				}
				out.write(String.valueOf(b));
				out.flush();
				out.close();
			}
        } catch (Exception e) {
			log.error("热点论坛，收藏热门主题失败，失败原因：" + e.getMessage());
		}
	}
	
}
