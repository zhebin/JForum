
var XPCH;
if (!XPCH) XPCH = {};

XPCH.TabbedPanels = function(element, opts)
{
	this.element = this.getElement(element);
	this.tabGroup = this.getElement(element.tabArea);
	this.contentGroup = this.getElement(element.contentArea);
	this.defaultTab = 0; // Show the first panel by default.
	this.tabSelectedClass = "xpchTabSelected";
	this.tabHoverClass = "xpchTabHover";
	this.tabFocusedClass = "xpchTabFocused";
	this.panelVisibleClass = "TabbedPanelsContentVisible";
	this.focusElement = null;
	this.hasFocus = false;
	this.currentTabIndex = 0;
	this.defaultEvent = "click";
	this.enableKeyboardNavigation = true;
	this.nextPanelKeyCode = XPCH.TabbedPanels.KEY_RIGHT;
	this.previousPanelKeyCode = XPCH.TabbedPanels.KEY_LEFT;

	var self = this;
	XPCH.TabbedPanels.addEventListener(this.tabGroup.parentNode, "resize", function() { return self.validation() }, false);
	
	XPCH.TabbedPanels.setOptions(this, opts);

	// If the defaultTab is expressed as a number/index, convert
	// it to an element.

	if (typeof (this.defaultTab) == "number")
	{
		if (this.defaultTab < 0)
			this.defaultTab = 0;
		else
		{
			var count = this.getTabbedPanelCount();
			if (this.defaultTab >= count)
				this.defaultTab = (count > 1) ? (count - 1) : 0;
		}

		this.defaultTab = this.getTabs()[this.defaultTab];
	}

	// The defaultTab property is supposed to be the tab element for the tab content
	// to show by default. The caller is allowed to pass in the element itself or the
	// element's id, so we need to convert the current value to an element if necessary.

	if (this.defaultTab)
		this.defaultTab = this.getElement(this.defaultTab);

	this.attachBehaviors();
	this.validation();
};
XPCH.TabbedPanels.prototype.validation = function(label,callback)
{
	var childrenTabs = this.getElementChildren(this.tabGroup);
	var sumWidth = 0;
	var conditionsWidth = this.tabGroup.parentNode.clientWidth;
	for(var i = 0; i < childrenTabs.length; i++){
		sumWidth += childrenTabs[i].clientWidth;
	}
	if(sumWidth > conditionsWidth){
		this.tabGroup.style.left = "0px";
		this.tabGroup.style.width = "10000px";
	}else{
		this.tabGroup.style.left = "";
		this.tabGroup.style.width = "auto";
	}
};
XPCH.TabbedPanels.prototype.setTab = function(label,callback)
{
	var tab = document.createElement("li");
	tab.className = "xpchTab";
	return tab;
};
XPCH.TabbedPanels.prototype.setContent = function()
{
	var content = document.createElement("div");
	content.className = "TabbedPanelsContent";
	return content;
};
XPCH.TabbedPanels.prototype.setTabGroup = function(tabGroup)
{
	this.tabGroup = tabGroup;
};
XPCH.TabbedPanels.prototype.setContentGroup = function(contentGroup)
{
	this.contentGroup = contentGroup;
};
XPCH.TabbedPanels.prototype.getElement = function(ele)
{
	if (ele && typeof ele == "string")
		return document.getElementById(ele);
	return ele;
};

XPCH.TabbedPanels.prototype.getElementChildren = function(element)
{
	var children = [];
	var child = element.firstChild;
	while (child)
	{
		if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
			children.push(child);
		child = child.nextSibling;
	}
	return children;
};

XPCH.TabbedPanels.prototype.addClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) != -1))
		return;
	ele.className += (ele.className ? " " : "") + className;
};

XPCH.TabbedPanels.prototype.removeClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) == -1))
		return;
	ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), "");
};

XPCH.TabbedPanels.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
{
	if (!optionsObj)
		return;
	for (var optionName in optionsObj)
	{
		if (ignoreUndefinedProps && optionsObj[optionName] == undefined)
			continue;
		obj[optionName] = optionsObj[optionName];
	}
};

XPCH.TabbedPanels.prototype.getTabGroup = function()
{
	if (this.element)
	{
		var children = this.getElementChildren(this.element);
		if (children.length)
			return children[0];
	}
	return null;
};

XPCH.TabbedPanels.prototype.getTabs = function()
{
	var tabs = [];
	var tg = this.tabGroup || this.getTabGroup();
	if (tg)
		tabs = this.getElementChildren(tg);
	return tabs;
};

XPCH.TabbedPanels.prototype.getContentPanelGroup = function()
{
	if (this.element)
	{
		var children = this.getElementChildren(this.element);
		if (children.length > 1)
			return children[1];
	}
	return null;
};

XPCH.TabbedPanels.prototype.getContentPanels = function()
{
	var panels = [];
	var pg = this.contentGroup || this.getContentPanelGroup();
	if (pg)
		panels = this.getElementChildren(pg);
	return panels;
};

XPCH.TabbedPanels.prototype.getIndex = function(ele, arr)
{
	ele = this.getElement(ele);
	if (ele && arr && arr.length)
	{
		for (var i = 0; i < arr.length; i++)
		{
			if (ele == arr[i])
				return i;
		}
	}
	return -1;
};

XPCH.TabbedPanels.prototype.getTabIndex = function(ele)
{
	var i = this.getIndex(ele, this.getTabs());
	if (i < 0)
		i = this.getIndex(ele, this.getContentPanels());
	return i;
};

XPCH.TabbedPanels.prototype.getCurrentTabIndex = function()
{
	return this.currentTabIndex;
};

XPCH.TabbedPanels.prototype.getTabbedPanelCount = function(ele)
{
	return Math.min(this.getTabs().length, this.getContentPanels().length);
};

XPCH.TabbedPanels.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (element.addEventListener)
			element.addEventListener(eventType, handler, capture);
		else if (element.attachEvent)
			element.attachEvent("on" + eventType, handler);
	}
	catch (e) {}
};

XPCH.TabbedPanels.prototype.cancelEvent = function(e)
{
	if (e.preventDefault) e.preventDefault();
	else e.returnValue = false;
	if (e.stopPropagation) e.stopPropagation();
	else e.cancelBubble = true;

	return false;
};

XPCH.TabbedPanels.prototype.onTabClick = function(e, tab)
{
	this.showPanel(tab);
	
	var tpIndex = this.getTabIndex(tab);
	var panels = this.getContentPanels();
	var panel = panels[tpIndex];
	var iframe_ = panel.getElementsByTagName('iframe')[0];
   
	if(iframe_ && iframe_.src.substr(-1,1) == '#')iframe_.src = tab.getAttribute('defaultUrl') || '#';
	var mainPageUrl = tab.getAttribute('mainPageUrl');
	if(mainPageUrl && mainPageUrl != ''){
		document.getElementById('mainIframe').src = mainPageUrl;
	}

	return this.cancelEvent(e);
};

XPCH.TabbedPanels.prototype.onTabMouseOver = function(e, tab)
{
	this.addClassName(tab, this.tabHoverClass);
	return false;
};

XPCH.TabbedPanels.prototype.onTabMouseOut = function(e, tab)
{
	this.removeClassName(tab, this.tabHoverClass);
	return false;
};

XPCH.TabbedPanels.prototype.onTabFocus = function(e, tab)
{
	this.hasFocus = true;
	this.addClassName(tab, this.tabFocusedClass);
	return false;
};

XPCH.TabbedPanels.prototype.onTabBlur = function(e, tab)
{
	this.hasFocus = false;
	this.removeClassName(tab, this.tabFocusedClass);
	return false;
};

XPCH.TabbedPanels.KEY_UP = 38;
XPCH.TabbedPanels.KEY_DOWN = 40;
XPCH.TabbedPanels.KEY_LEFT = 37;
XPCH.TabbedPanels.KEY_RIGHT = 39;



XPCH.TabbedPanels.prototype.onTabKeyDown = function(e, tab)
{
	var key = e.keyCode;
	if (!this.hasFocus || (key != this.previousPanelKeyCode && key != this.nextPanelKeyCode))
		return true;

	var tabs = this.getTabs();
	for (var i =0; i < tabs.length; i++)
		if (tabs[i] == tab)
		{
			var el = false;
			if (key == this.previousPanelKeyCode && i > 0)
				el = tabs[i-1];
			else if (key == this.nextPanelKeyCode && i < tabs.length-1)
				el = tabs[i+1];

			if (el)
			{
				this.showPanel(el);
				el.focus();
				break;
			}
		}

	return this.cancelEvent(e);
};

XPCH.TabbedPanels.prototype.preorderTraversal = function(root, func)
{
	var stopTraversal = false;
	if (root)
	{
		stopTraversal = func(root);
		if (root.hasChildNodes())
		{
			var child = root.firstChild;
			while (!stopTraversal && child)
			{
				stopTraversal = this.preorderTraversal(child, func);
				try { child = child.nextSibling; } catch (e) { child = null; }
			}
		}
	}
	return stopTraversal;
};

XPCH.TabbedPanels.prototype.addPanelEventListeners = function(tab, panel)
{
	var self = this;
	if(this.defaultEvent == "click"){
		XPCH.TabbedPanels.addEventListener(tab, "click", function(e) { return self.onTabClick(e, tab); }, false);
		XPCH.TabbedPanels.addEventListener(tab, "mouseover", function(e) { return self.onTabMouseOver(e, tab); }, false);
		XPCH.TabbedPanels.addEventListener(tab, "mouseout", function(e) { return self.onTabMouseOut(e, tab); }, false);
	}else{
		XPCH.TabbedPanels.addEventListener(tab, this.defaultEvent, function(e) { return self.onTabClick(e, tab); }, false);
	}

	if (this.enableKeyboardNavigation)
	{
		// XXX: IE doesn't allow the setting of tabindex dynamically. This means we can't
		// rely on adding the tabindex attribute if it is missing to enable keyboard navigation
		// by default.

		// Find the first element within the tab container that has a tabindex or the first
		// anchor tag.
		
		var tabIndexEle = null;
		var tabAnchorEle = null;

		this.preorderTraversal(tab, function(node) {
			if (node.nodeType == 1 /* NODE.ELEMENT_NODE */)
			{
				var tabIndexAttr = tab.attributes.getNamedItem("tabindex");
				if (tabIndexAttr)
				{
					tabIndexEle = node;
					return true;
				}
				if (!tabAnchorEle && node.nodeName.toLowerCase() == "a")
					tabAnchorEle = node;
			}
			return false;
		});

		if (tabIndexEle)
			this.focusElement = tabIndexEle;
		else if (tabAnchorEle)
			this.focusElement = tabAnchorEle;

		if (this.focusElement)
		{
			XPCH.TabbedPanels.addEventListener(this.focusElement, "focus", function(e) { return self.onTabFocus(e, tab); }, false);
			XPCH.TabbedPanels.addEventListener(this.focusElement, "blur", function(e) { return self.onTabBlur(e, tab); }, false);
			XPCH.TabbedPanels.addEventListener(this.focusElement, "keydown", function(e) { return self.onTabKeyDown(e, tab); }, false);
		}
	}
};

XPCH.TabbedPanels.prototype.showPanel = function(elementOrIndex)
{
	var tpIndex = -1;
	
	if (typeof elementOrIndex == "number")
		tpIndex = elementOrIndex;
	else // Must be the element for the tab or content panel.
		tpIndex = this.getTabIndex(elementOrIndex);
	
	if (!tpIndex < 0 || tpIndex >= this.getTabbedPanelCount())
		return;

	var tabs = this.getTabs();
	var panels = this.getContentPanels();

	var numTabbedPanels = Math.max(tabs.length, panels.length);

	for (var i = 0; i < numTabbedPanels; i++)
	{
		if (i != tpIndex)
		{
			if (tabs[i])
				this.removeClassName(tabs[i], this.tabSelectedClass);
			if (panels[i])
			{
				this.removeClassName(panels[i], this.panelVisibleClass);
				panels[i].style.display = "none";
			}
		}
	}

	this.addClassName(tabs[tpIndex], this.tabSelectedClass);
	this.addClassName(panels[tpIndex], this.panelVisibleClass);
	panels[tpIndex].style.display = "";

	this.currentTabIndex = tpIndex;
};

XPCH.TabbedPanels.prototype.attachBehaviors = function(element)
{
	var tabs = this.getTabs();
	var panels = this.getContentPanels();
	var panelCount = this.getTabbedPanelCount();

	for (var i = 0; i < panelCount; i++)
		this.addPanelEventListeners(tabs[i], panels[i]);

	this.showPanel(this.defaultTab);
};
