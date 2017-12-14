/*
 * Copyright (c) JForum Team
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
 * This file creation date: Apr 5, 2003 / 11:43:46 PM
 * The JForum Project
 * http://www.jforum.net
 */
package net.jforum.dao.generic;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import net.jforum.JForumExecutionContext;
import net.jforum.dao.UserOwnGroupDAO;
import net.jforum.entities.User;
import net.jforum.entities.UserOwnGroup;
import net.jforum.entities.UserOwnGroupUser;
import net.jforum.exceptions.DatabaseException;
import net.jforum.util.DbUtils;
import net.jforum.util.preferences.SystemGlobals;

public class GenericUserOwnGroupDAO extends AutoKeys implements UserOwnGroupDAO {

	public UserOwnGroup selectById(int groupId) {
		String q = SystemGlobals.getSql("UserOwnGroup.selectById");
		PreparedStatement p = null;
		ResultSet rs = null;

		try {
			p = JForumExecutionContext.getConnection().prepareStatement(q);
			p.setInt(1, groupId);

			rs = p.executeQuery();
			UserOwnGroup u = new UserOwnGroup();

			if (rs.next()) {
				this.fillBeanFromResultSet(u, rs);
				rs.close();
				p.close();
			}
			return u;
		} catch (SQLException e) {
			throw new DatabaseException(e);
		} finally {
			DbUtils.close(rs, p);
		}
	}

	public List selectByUserId(int userId) {
		List result = new ArrayList();
		String q = SystemGlobals.getSql("UserOwnGroup.selectByUserId");
		PreparedStatement p = null;
		ResultSet rs = null;

		try {
			p = JForumExecutionContext.getConnection().prepareStatement(q);
			p.setInt(1, userId);

			rs = p.executeQuery();

			UserOwnGroup u = new UserOwnGroup();
			while (rs.next()) {
				this.fillBeanFromResultSet(u, rs);
				result.add(u);
			}

			rs.close();
			p.close();
			return result;
		} catch (SQLException e) {
			throw new DatabaseException(e);
		} finally {
			DbUtils.close(rs, p);
		}
	}

	public List selectAllByUserId(int userId) {
		List result = new ArrayList();
		String q = SystemGlobals.getSql("UserOwnGroup.selectByUserId");
		PreparedStatement p = null;
		ResultSet rs = null;

		try {
			p = JForumExecutionContext.getConnection().prepareStatement(q);
			p.setInt(1, userId);

			rs = p.executeQuery();

			
			while (rs.next()) {
				UserOwnGroup u = new UserOwnGroup();
				this.fillBeanFromResultSet(u, rs);
				// 群组下的所有用户
				PreparedStatement p1 = JForumExecutionContext
						.getConnection()
						.prepareStatement(
								SystemGlobals
										.getSql("UserOwnGroupUser.selectUserByGroupId"));
				p1.setInt(1, u.getGroupId());
				ResultSet rs1 = p1.executeQuery();
				List list = new ArrayList();
				while (rs1.next()) {
					User g = new User();
					g.setId(rs1.getInt("user_id"));
					g.setMsnm(rs1.getString("user_msnm"));
					list.add(g);
				}
				u.setList(list);
				result.add(u);
			}

			rs.close();
			p.close();
			return result;
		} catch (SQLException e) {
			throw new DatabaseException(e);
		} finally {
			DbUtils.close(rs, p);
		}
	}

	protected void fillBeanFromResultSet(UserOwnGroup u, ResultSet rs)
			throws SQLException {
		u.setGroupId(rs.getInt("group_id"));
		u.setGroupName(rs.getString("group_name"));
		u.setCreateTime(rs.getDate("create_time"));
		u.setUserId(rs.getInt("user_id"));
	}

	public void delete(int groupId) {
		PreparedStatement p = null;
		try {
			p = JForumExecutionContext.getConnection().prepareStatement(
					SystemGlobals.getSql("UserOwnGroup.delete"));
			p.setInt(1, groupId);
			p.executeUpdate();
		} catch (SQLException e) {
			throw new DatabaseException(e);
		} finally {
			DbUtils.close(p);
		}
	}

	public void update(UserOwnGroup bean) {
		PreparedStatement p = null;
		try {
			p = JForumExecutionContext.getConnection().prepareStatement(
					SystemGlobals.getSql("UserOwnGroup.update"));

			p.setString(1, bean.getGroupName());
			p.setInt(2, bean.getGroupId());
			p.executeUpdate();
		} catch (SQLException e) {
			throw new DatabaseException(e);
		} finally {
			DbUtils.close(p);
		}
	}

	public int add(UserOwnGroup bean) {
		PreparedStatement p = null;
		try {
			p = this.getStatementForAutoKeys("UserOwnGroup.addNew");
			p.setString(1, bean.getGroupName());
			p.setDate(2, new Date(new java.util.Date().getTime()));
			p.setInt(3, bean.getUserId());
			this.setAutoGeneratedKeysQuery(SystemGlobals
					.getSql("UserOwnGroup.lastGeneratedId"));
			int id = this.executeAutoKeysQuery(p);

			// this.addToGroup(id, new int[] {
			// SystemGlobals.getIntValue(ConfigKeys.DEFAULT_USER_GROUP) });
			return id;
		} catch (SQLException e) {
			throw new DatabaseException(e);
		} finally {
			DbUtils.close(p);
		}
	}

	@Override
	public void addRelation(UserOwnGroupUser userOwnGroupUser) {
		String q = SystemGlobals.getSql("UserOwnGroupUser.addNew");
		PreparedStatement p = null;
		ResultSet rs = null;

		try {
			p = JForumExecutionContext.getConnection().prepareStatement(q);
			p.setInt(1, userOwnGroupUser.getGroupId());
			p.setInt(2, userOwnGroupUser.getUserId());
			rs = p.executeQuery();
		} catch (SQLException e) {
			throw new DatabaseException(e);
		} finally {
			DbUtils.close(rs, p);
		}
		
	}

	@Override
	public void delRelation(UserOwnGroupUser userOwnGroupUser) {
		PreparedStatement p = null;
		try {
			p = JForumExecutionContext.getConnection().prepareStatement(
					SystemGlobals.getSql("UserOwnGroupUser.delete"));
			p.setInt(1, userOwnGroupUser.getGroupId());
			p.setInt(2, userOwnGroupUser.getUserId());
			p.executeUpdate();
		} catch (SQLException e) {
			throw new DatabaseException(e);
		} finally {
			DbUtils.close(p);
		}
		
	}

	@Override
	public List findRelation(UserOwnGroupUser userOwnGroupUser) {
		PreparedStatement p = null;
		ResultSet rs = null;
		List list = new ArrayList();
		try {
			p = JForumExecutionContext.getConnection().prepareStatement(
					SystemGlobals.getSql("UserOwnGroupUser.find"));
			p.setInt(1, userOwnGroupUser.getGroupId());
			p.setInt(2, userOwnGroupUser.getUserId());
			rs = p.executeQuery();
			if(rs.next()){
				UserOwnGroupUser bean = new UserOwnGroupUser();
				bean.setGroupId(rs.getInt("group_id"));
				bean.setUserId(rs.getInt("user_id"));
				list.add(bean);
				return list;
			}
			return list;
		} catch (SQLException e) {
			throw new DatabaseException(e);
		} finally {
			DbUtils.close(p);
		}
		
	}
}