/*
 * Copyright (c) Rafael Steil
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, 
 * with or without modification, are permitted provided 
 * that the following conditions are met:
 * 
 * 1) Redistributions of source code must retain the above 
 * copyright notice, this list of conditions and the 
 * following  disclaimer.
 * 2)  Redistributions in binary form must reproduce the 
 * above copyright notice, this list of conditions and 
 * the following disclaimer in the documentation and/or 
 * other materials provided with the distribution.
 * 3) Neither the name of "Rafael Steil" nor 
 * the names of its contributors may be used to endorse 
 * or promote products derived from this software without 
 * specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT 
 * HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, 
 * BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF 
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR 
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL 
 * THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE 
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES 
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, 
 * OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER 
 * IN CONTRACT, STRICT LIABILITY, OR TORT 
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN 
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF 
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE
 * 
 * This file creation date: Mar 28, 2003 / 8:09:08 PM
 * The JForum Project
 * http://www.jforum.net
 */
package net.jforum.view.admin;


import net.jforum.JForumExecutionContext;
import net.jforum.dao.DataAccessDriver;
import net.jforum.dao.RankingDAO;
import net.jforum.entities.Ranking;
import net.jforum.entities.User;
import net.jforum.repository.RankingRepository;
import net.jforum.util.I18n;
import net.jforum.util.MD5;
import net.jforum.util.image.ImageUtils;
import net.jforum.util.legacy.commons.fileupload.FileItem;
import net.jforum.util.preferences.ConfigKeys;
import net.jforum.util.preferences.SystemGlobals;
import net.jforum.util.preferences.TemplateKeys;
import net.jforum.view.forum.common.UploadUtils;
import net.jforum.view.forum.common.UserCommon;

import java.awt.image.BufferedImage;
import java.io.File;
import java.util.UUID;

/**
 * @author Rafael Steil
 * @version $Id: RankingAction.java,v 1.11 2006/12/02 03:19:51 rafaelsteil Exp $
 */
public class RankingAction extends AdminCommand 
{
	// List
	public void list()
	{
		this.context.put("ranks", DataAccessDriver.getInstance().newRankingDAO().selectAll());
		this.setTemplateName(TemplateKeys.RANKING_LIST);
	}
	
	// One more, one more,用户等级插入
	public void insert()
	{
		this.setTemplateName(TemplateKeys.RANKING_INSERT);
		this.context.put("action", "insertSave");
	}
	
	// Edit
	public void edit()
	{
		this.setTemplateName(TemplateKeys.RANKING_EDIT);
		this.context.put("action", "editSave");
		this.context.put("rank", DataAccessDriver.getInstance().newRankingDAO().selectById(
			this.request.getIntParameter("ranking_id")));
	}
	
	//  Save information
	public void editSave()
	{
        Ranking r = DataAccessDriver.getInstance().newRankingDAO().selectById(this.request.getIntParameter("rank_id"));
		r.setTitle(this.request.getParameter("rank_title"));
		
		boolean special = "1".equals(this.request.getParameter("rank_special"));
		r.setSpecial(special);
		
		if (!special) {
			r.setMin(this.request.getIntParameter("rank_min"));
		}

        handleImage(r);
		
		DataAccessDriver.getInstance().newRankingDAO().update(r);
		RankingRepository.loadRanks();	
		this.list();
	}
	
	// Delete
	public void delete()
	{
		String ids[] = this.request.getParameterValues("rank_id");
		
		RankingDAO rm = DataAccessDriver.getInstance().newRankingDAO();
		
		if (ids != null) {
			for (int i = 0; i < ids.length; i++) {
				rm.delete(Integer.parseInt(ids[i]));
			}
		}
			
		this.list();
	}
	
	// A new one
	public void insertSave() 
	{
		Ranking r = new Ranking();
		r.setTitle(this.request.getParameter("rank_title"));
		
		boolean special = "1".equals(this.request.getParameter("rank_special"));
		r.setSpecial(special);
		
		if (!special) {
			r.setMin(this.request.getIntParameter("rank_min"));			
		}

		handleImage(r);
		
		DataAccessDriver.getInstance().newRankingDAO().addNew(r);
		
		RankingRepository.loadRanks();
		
		this.list();
	}

	private void handleImage(Ranking r){
        if (request.getObjectParameter("image") != null) {
            try {
                handleAvatar(r);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**r
     * @param r
     */
    private static void handleAvatar(Ranking r)
    {
        String fileName = UUID.randomUUID().toString();
        FileItem item = (FileItem) JForumExecutionContext.getRequest().getObjectParameter("image");
        UploadUtils uploadUtils = new UploadUtils(item);

        // Gets file extension
        String extension = uploadUtils.getExtension().toLowerCase();
        int type = ImageUtils.IMAGE_UNKNOWN;

        if (extension.equals("jpg") || extension.equals("jpeg")) {
            type = ImageUtils.IMAGE_JPEG;
        }
        else if (extension.equals("gif") || extension.equals("png")) {
            type = ImageUtils.IMAGE_PNG;
        }

        if (type != ImageUtils.IMAGE_UNKNOWN) {
            String avatarTmpFileName = SystemGlobals.getApplicationPath()
                    + "/images/rank/"
                    + fileName
                    + "_tmp."
                    + extension;

            // We cannot handle gifs
            if (extension.toLowerCase().equals("gif")) {
                extension = "png";
            }

            String avatarFinalFileName = SystemGlobals.getApplicationPath()
                    + "/images/rank/"
                    + fileName
                    + "."
                    + extension;

            uploadUtils.saveUploadedFile(avatarTmpFileName);

            // OK, time to check and process the avatar size
            int maxWidth = SystemGlobals.getIntValue(ConfigKeys.AVATAR_MAX_WIDTH);
            int maxHeight = SystemGlobals.getIntValue(ConfigKeys.AVATAR_MAX_HEIGHT);

            BufferedImage image = ImageUtils.resizeImage(avatarTmpFileName, type, maxWidth, maxHeight);
            ImageUtils.saveImage(image, avatarFinalFileName, type);

            r.setImage(fileName + "." + extension);

            // Delete the temporary file
            new File(avatarTmpFileName).delete();
        }
    }
}
