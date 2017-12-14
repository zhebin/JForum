<#function moderationParams>
	<#assign params = ""/>

	<#if (searchArgs.keywords?size > 0)><#assign params = params +"&amp;search_keywords="+ searchArgs.rawKeywords()/></#if>
	<#if (searchArgs.forumId > 0)><#assign params = params +"&amp;search_forum="+ searchArgs.forumId/></#if>
	<#if (searchArgs.author > 0)><#assign params = params +"&amp;search_author="+ searchArgs.author/></#if>
	<#if (searchArgs.matchType?default("")?length > 0)><#assign params = params +"&amp;match_type="+ searchArgs.matchType/></#if>
	<#if (searchArgs.orderDir?default("")?length > 0)><#assign params = params +"&amp;sort_dir="+ searchArgs.orderDir/></#if>
	<#if (searchArgs.orderBy?default("")?length > 0)><#assign params = params +"&amp;sort_by="+ searchArgs.orderBy/></#if>

	<#return params/>
</#function>

<#macro searchPagination>
	<#if (totalRecords > recordsPerPage)>
		<#assign baseUrl = '${JForumContext.encodeURL("/jforum" )}' + "?module=search&amp;action=search"/>
		<#assign baseUrl = baseUrl + moderationParams()/>

		<div class="pages">
			<#assign link = ""/>
	
			<#-- ------------- -->
			<#-- Previous page -->
			<#-- ------------- -->
			<#if (thisPage > 1)>
				<#assign start = (thisPage - 2) * recordsPerPage/>
				<a href="${baseUrl}&amp;start=${start}">&#9668;</a>
			<#else>
				<a>&#9668;</a>
			</#if>
	
			<#if (totalPages > 10)>
				<#-- ------------------------------ -->
				<#-- Always write the first 3 links -->
				<#-- ------------------------------ -->
				<#list 1 .. 3 as page>
					<@pageLink page, baseUrl/>
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
							<@pageLink page, baseUrl/>
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
					<@pageLink page, baseUrl/>
				</#list>
			<#else>
				<#list 1 .. totalPages as page>
					<@pageLink page, baseUrl/>
				</#list>
			</#if>
	
			<#-- ------------- -->
			<#-- Next page -->
			<#-- ------------- -->
			<#if (thisPage < totalPages)>
				<#assign start = thisPage * recordsPerPage/>
				<a href="${baseUrl}&amp;start=${start}">&#9658;</a>
			<#else>
				<a>&#9658;</a>
			</#if>
		</div>
		<#--
		<div id="goToBox" class="pages">
			<b>${I18n.getMessage("goToPage")}:</b>
			<input type="text" style="width: 50px;" id="pageToGo">
			<input class="submit" type="button" value=" ${I18n.getMessage("ForumIndex.goToGo")} " onClick="goToAnotherPageSearch(${totalPages}, ${recordsPerPage}, '${baseUrl}');">
		</div>
		-->
	</#if>
</#macro>

<#macro pageLink page baseUrl>
	<#assign start = recordsPerPage * (page - 1)/>
	<#if page != thisPage>
		<#assign link><a href="${baseUrl}&amp;start=${start}">${page}</a></#assign>
	<#else>
		<#assign link><strong>${page}</strong></#assign>
	</#if>
	${link}
</#macro>
