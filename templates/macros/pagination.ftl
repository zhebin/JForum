<#macro littlePostPagination topicId postsPerPage totalReplies>
	[${I18n.getMessage("goToPage")}: 

	<#assign totalPostPages = ((totalReplies + 1) / postsPerPage)?int/>

	<#if (((totalReplies + 1) % postsPerPage) > 0)>
		<#assign totalPostPages = (totalPostPages + 1)/>
	</#if>

	<#if (totalPostPages > 6)>
		<#assign minTotal = 3/>
	<#else>
		<#assign minTotal = totalPostPages/>
	</#if>

	<#-- ----------- -->
	<#-- First pages -->
	<#-- ----------- -->
	<#assign link = ""/>

	<#list 1 .. minTotal as page>
		<#assign start = postsPerPage * (page - 1)/>
		<#assign hrefUrl = "/posts/list/${topicId}" />
		<#if (start>0)>
			<#assign hrefUrl = "/posts/list/${start}/${topicId}" />
		</#if>
		<#assign link>${link}<a href="${JForumContext.encodeURL("${hrefUrl}")}">${page}</a></#assign>
		<#if (page < minTotal)><#assign link>${link}, </#assign></#if>		
	</#list>

	${link}

	<#assign link = ""/>
	<#if (totalPostPages > 6)>
		&nbsp;...&nbsp;
		<#list totalPostPages - 2 .. totalPostPages as page>
			<#assign start = postsPerPage * (page - 1)/>
			<#assign hrefUrl = "/posts/list/${topicId}" />
			<#if (start>0)>
				<#assign hrefUrl = "/posts/list/${start}/${topicId}" />
			</#if>
			<#assign link>${link}<a href="${JForumContext.encodeURL("${hrefUrl}")}">${page}</a></#assign>
			<#if (page_index + 1 < 3)><#assign link>${link}, </#assign></#if>
		</#list>

		${link}
	</#if>

	]
</#macro>

<#-- ------------------------------------------------------------------------------- -->
<#-- Pagination macro base code inspired from PHPBB's generate_pagination() function -->
<#-- ------------------------------------------------------------------------------- -->
<#macro doPagination action id=-1>
	<#if (totalRecords > recordsPerPage)>
		<div class="pages">
		<#assign link = ""/>

		<#-- ------------- -->
		<#-- Previous page -->
		<#-- ------------- -->
		<#if (thisPage > 1)>
			<#assign start = (thisPage - 2) * recordsPerPage/>
			<#assign hrefUrl = "/${moduleName}/${action}" />
			<#if (start>0)>
				<#assign hrefUrl = "${hrefUrl}/${start}" />
			</#if>
			<#if (id > -1)>
				<#assign hrefUrl = "${hrefUrl}/${id}" />
			</#if>
			<a href="${JForumContext.encodeURL("${hrefUrl}")}">&#9668;</a>
		<#else>
			<a>&#9668;</a>
		</#if>

		<#if (totalPages > 10)>
			<#-- ------------------------------ -->
			<#-- Always write the first 3 links -->
			<#-- ------------------------------ -->
			<#list 1 .. 3 as page>
				<@pageLink page, id/>
			</#list>

			<#-- ------------------ -->
			<#-- Intermediate links -->
			<#-- ------------------ -->
			<#if (thisPage > 1 && thisPage < totalPages)>
				<#if (thisPage > 5)><a>...</a></#if>

				<#if (thisPage > 4)>
					<#assign min = thisPage - 1/>
				<#else>
					<#assign min = 4/>
				</#if>

				<#if (thisPage < totalPages - 4)>
					<#assign max = thisPage + 2/>
				<#else>
					<#assign max = totalPages - 2/>
				</#if>

				<#if (max >= min + 1)>
					<#list min .. max - 1 as page>
						<@pageLink page, id/>
					</#list>
				</#if>

				<#if (thisPage < totalPages - 4)><a>...</a></#if>
			<#else>
				<a>...</a>
			</#if>

			<#-- ---------------------- -->
			<#-- Write the last 3 links -->
			<#-- ---------------------- -->
			<#list totalPages - 2 .. totalPages as page>
				<@pageLink page, id/>
			</#list>
		<#else>
			<#list 1 .. totalPages as page>
				<@pageLink page, id/>
			</#list>
		</#if>

		<#-- ------------- -->
		<#-- Next page -->
		<#-- ------------- -->
		<#if (thisPage < totalPages)>
			<#assign start = thisPage * recordsPerPage/>
			<#assign hrefUrl = "/${moduleName}/${action}" />
			<#if (start>0)>
				<#assign hrefUrl = "${hrefUrl}/${start}" />
			</#if>
			<#if (id > -1)>
				<#assign hrefUrl = "${hrefUrl}/${id}" />
			</#if>
			<a href="${JForumContext.encodeURL("${hrefUrl}")}">&#9658;</a>
		<#else>
			<a>&#9658;</a>
		</#if>

		</div>
		<#--
		<div class="pages">
			<b>${I18n.getMessage("goToPage")}:</b>
			<input type="text" style="width: 50px;" id="pageToGo">
			<input class="submit" type="button" value="&nbsp;${I18n.getMessage("ForumIndex.goToGo")}&nbsp;" onClick="goToAnotherPage(${totalPages}, ${recordsPerPage}, '${moduleName}', '${action}', ${id});">
		</div>
		-->
	</#if>
</#macro>

<#macro pageLink page id>
	<#assign start = recordsPerPage * (page - 1)/>
	<#if page != thisPage>
		<#assign hrefUrl = "/${moduleName}/${action}" />
		<#if (start>0)>
			<#assign hrefUrl = "${hrefUrl}/${start}" />
		</#if>
		<#if (id > -1)>
			<#assign hrefUrl = "${hrefUrl}/${id}" />
		</#if>
		<#assign link><a href="${JForumContext.encodeURL("${hrefUrl}")}">${page}</a></#assign>
	<#else>
		<#assign link><strong>${page}</strong></#assign>
	</#if>
	${link}
</#macro>
