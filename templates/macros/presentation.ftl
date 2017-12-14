<#-- ********************************************* -->
<#-- Displays the topic folder image by its status -->
<#-- ********************************************* -->
<#macro folderImage topic>
	<#if topic.read>
		<#if topic.status == STATUS_UNLOCKED>
			<#if topic.type == TOPIC_ANNOUNCE>
				<img class="icon_folder_announce" src="${contextPath}/templates/${templateName}/images/icon_folder_announce.gif" alt="" />
			<#elseif topic.type == TOPIC_STICKY>
				<img class="icon_folder_sticky" src="${contextPath}/templates/${templateName}/images/icon_folder_sticky.gif" alt="" />
			<#else>
				<img class="icon_folder" src="${contextPath}/templates/${templateName}/images/folder_common.gif" alt="" />
			</#if>
		<#else>
			<img class="icon_folder_lock" src="${contextPath}/templates/${templateName}/images/folder_lock.gif" alt="" />
		</#if>
	<#else>
		<#if topic.status == STATUS_UNLOCKED>
			<img class="icon_folder" src="${contextPath}/templates/${templateName}/images/folder_unread.gif" alt="" />
		<#else>
			<img class="icon_folder_lock" src="${contextPath}/templates/${templateName}/images/folder_lock_new.gif" alt="" />
		</#if>
	</#if>
</#macro>

<#macro renderPoll poll>
	<table class="poll">
		<#list poll.options as option>
			<tr>
				<td style="border-top:0px;">${option.text}</td>
				<td width="70%" style="border-top:0px;">
					<img src="${contextPath}/templates/${templateName}/images/voting_bar.gif" width="${option.votePercentage * 3}" height="12" alt=""  />
				</td>
				<td width="5%" style="border-top:0px;"><b>${option.votePercentage}%</b></td>
				<td width="5%" style="border-top:0px;">[ <b>${option.voteCount}</b> ]</td>
			</tr>
		</#list>
		<tr>
			<#if (poll.open && canVoteOnPoll)>
				<td>
					<input type="button" class="submit" value="${I18n.getMessage("PostShow.returnToPoll")}" onclick="document.location='${JForumContext.encodeURL("/jforum${extension}?module=posts&amp;action=list&amp;topic_id=${topic.id}", "")}'"></input>
				</td>
				<td colspan="3" class="strong" align="right"><b>${I18n.getMessage("PostShow.pollTotalVotes")} <font color="red">${poll.totalVotes}</font></b></td>
			<#else>
				<td colspan="4" class="strong" align="right"><b>${I18n.getMessage("PostShow.pollTotalVotes")} <font color="red">${poll.totalVotes}</font></b></td>
			</#if>
		</tr>
	</table>
</#macro>

<#macro row1Class topic><#if topic.type == TOPIC_ANNOUNCE>row1Announce<#elseif topic.type == TOPIC_STICKY>row1sticky<#else>row1</#if></#macro>
<#macro row2Class topic><#if topic.type == TOPIC_ANNOUNCE>row2Announce<#elseif topic.type == TOPIC_STICKY>row2sticky<#else>row2</#if></#macro>
<#macro row3Class topic><#if topic.type == TOPIC_ANNOUNCE>row3Announce<#elseif topic.type == TOPIC_STICKY>row3sticky<#else>row3</#if></#macro>

<#-- ****************** -->
<#-- Moderation buttons -->
<#-- ****************** -->
<#macro moderationButtons>
	<#if moderator  && openModeration?default(false)>
		<#if can_remove_posts?default(false)><input class="submit" type="submit" name="topicRemove" value="&nbsp;${I18n.getMessage("Delete")}&nbsp;" class="liteoption" onclick="return validateModerationDelete();" /></#if>
		<#if can_move_topics?default(false)><input class="submit" type="submit" name="topicMove" value="&nbsp;${I18n.getMessage("move")}&nbsp;" class="liteoption" onclick="return verifyModerationCheckedTopics();" /></#if>
		<#if can_lockUnlock_topics?default(false)>
			<input class="submit" type="submit" name="topicLock" value="&nbsp;${I18n.getMessage("Lock")}&nbsp;" class="liteoption" onclick="return lockUnlock();" />
			<input class="submit" type="submit" name="topicUnlock" value="&nbsp;${I18n.getMessage("Unlock")}&nbsp;" class="liteoption" onclick="return lockUnlock();" />
		</#if>
		<#if can_creat_sticky_topics?default(false)>
			<input class="submit" type="submit" name="topicSticky" value="&nbsp;${I18n.getMessage("PostForm.setTopicAsSticky")}&nbsp;" class="liteoption" onclick="return stickynotsticky();" />
			<input class="submit" type="submit" name="topicNotSticky" value="&nbsp;${I18n.getMessage("PostForm.setTopicNotAsSticky")}&nbsp;" class="liteoption" onclick="return stickynotsticky();" />
		</#if>
	</#if>
</#macro>

<#-- ****************** -->
<#-- Moderation images -->
<#-- ****************** -->
<#macro moderationImages>
	<script type="text/javascript">
	function todo(name) { var todo = document.getElementById("moderationTodo"); todo.name = name; todo.value = "1"; }
	
	function deleteTopic() {
		if (confirm("${I18n.getMessage("Moderation.ConfirmDelete")}")) {
			todo("topicRemove");
			document.formModeration.returnUrl.value = "${JForumContext.encodeURL("/forums/show/${topic.forumId}")}";
			document.formModeration.log_type.value = "1";
			document.formModeration.submit();
		}
	}

	function moveTopic() {
		todo("topicMove");
		document.formModeration.submit();
	}

	function lockUnlock(lock) {
		document.formModeration.log_type.value = "3";
		todo(lock ? "topicLock" : "topicUnlock");
		document.formModeration.submit();
	}
	</script>
	<#if isModerator || isAdmin>
		<#if can_remove_posts?default(false)>
			<li><a href="javascript:deleteTopic();">${I18n.getMessage("Delete")}</a></li>
		</#if>
		
		<#if can_move_topics?default(false)>
			<li><a href="javascript:moveTopic();">${I18n.getMessage("move")}</a></li>
		</#if>

		<#if can_lockUnlock_topics?default(false)>			
			<#if topic.status == STATUS_LOCKED>
				<li><a href="javascript:lockUnlock(false);">${I18n.getMessage("Unlock")}</a></li>
			<#else>
				<li><a href="javascript:lockUnlock(true);">${I18n.getMessage("Lock")}</a></li>
			</#if>
		</#if>
	</#if>
</#macro>

<#-- ********************** -->
<#-- Forum navigation combo -->
<#-- ********************** -->
<#macro forumsComboTable>
	<table cellspacing="0" cellpadding="0" border="0">
		<tr>			  
			<td nowrap="nowrap">
				<form action="" name="f" id="f" accept-charset="${encoding}">
					<span class="gensmall">${I18n.getMessage("ForumIndex.goTo")}:&nbsp;</span>
					<select onchange="if(this.options[this.selectedIndex].value != -1){ window.location.href = '${JForumContext.encodeURL("/forums/show/'+ this.options[this.selectedIndex].value +'")}'; }" name="select">
						<option value="-1" selected="selected">${I18n.getMessage("ForumIndex.goToSelectAForum")}</option>				
						
						<#list allCategories as category>
                            <optgroup label="${category.name}">
		
							<#list category.getForums() as forum>
								<option value="${forum.id}">${forum.name}</option>
							</#list>
							
                            </optgroup>
						</#list>
					</select>
					&nbsp;
					<#--input class="liteoption" type="button" value="${I18n.getMessage("ForumIndex.goToGo")}" onclick="if(document.f.select.options[document.f.select.selectedIndex].value != -1){ document.location = '${contextPath}/forums/show/'+ document.f.select.options[document.f.select.selectedIndex].value +'${extension}'; }" /-->
				</form>
			</td>
		</tr>
	</table>
</#macro>
