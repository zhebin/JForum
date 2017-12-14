var XPCH;
if (!XPCH) XPCH = {};
if (!XPCH.Widget) XPCH.Widget = {};

XPCH.Sliding = function(element, opts)
{
	this.element = this.getElement(element);
	this.enableAnimation = true;
	this.autoPlay = false;
	this.autoPlayTime = 3;
	this.autoPlayInterval = 1000;
	this.scrollCellCount = 1;
	this.stopAutoSliding = false;
	this.lastReturnStart = false;
	this.loopable = true;
	
	this.panels = this.getContentPanels();
	this.panelsCount = this.getContentPanelsCount();
	
	this.currentPanel = null;
	this.enableKeyboardNavigation = true;
	this.hasFocus = false;
	this.previousPanelKeyCode = XPCH.Sliding.KEY_LEFT;
	this.nextPanelKeyCode = XPCH.Sliding.KEY_RIGHT;

	this.currentPanelClass = "SlidingPanelsCurrentPanel";
	this.focusedClass = "SlidingPanelsFocused";
	this.animatingClass = "SlidingPanelsAnimating";

	XPCH.Sliding.setOptions(this, opts);

	if (this.element)
		this.element.style.overflow = "hidden";

	// Developers can specify the default panel as an index,
	// id or an actual element node. Make sure to normalize
	// it into an element node because that is what we expect
	// internally.

	if (this.defaultPanel)
	{
		if (typeof this.defaultPanel == "number")
			this.currentPanel = this.panels[this.defaultPanel];
		else
			this.currentPanel = this.getElement(this.defaultPanel);
	}

	// If we still don't have a current panel, use the first one!

	if (!this.currentPanel)
		this.currentPanel = this.panels[0];

	// Since we rely on the positioning information of the
	// panels, we need to wait for the onload event to fire before
	// we can attempt to show the initial panel. Once the onload
	// fires, we know that all CSS files have loaded. This is
	// especially important for Safari.

	if (XPCH.Sliding.onloadDidFire)
		this.attachBehaviors();
	else
		XPCH.Sliding.loadQueue.push(this);
		
	if(this.autoPlay){
		this.initArutoPlay();
	}	
};

XPCH.Sliding.prototype.initArutoPlay = function(e)
{
	var self_ = this;
	setInterval(function(){
		self_.showNextPanel();
	},this.autoPlayInterval);
};
XPCH.Sliding.prototype.onFocus = function(e)
{
	this.hasFocus = true;
	this.addClassName(this.element, this.focusedClass);
	return false;
};

XPCH.Sliding.prototype.onBlur = function(e)
{
	this.hasFocus = false;
	this.removeClassName(this.element, this.focusedClass);
	return false;
};

XPCH.Sliding.KEY_LEFT = 37;
XPCH.Sliding.KEY_UP = 38;
XPCH.Sliding.KEY_RIGHT = 39;
XPCH.Sliding.KEY_DOWN = 40;

XPCH.Sliding.prototype.onKeyDown = function(e)
{
	var key = e.keyCode;
	if (!this.hasFocus || (key != this.previousPanelKeyCode && key != this.nextPanelKeyCode))
		return true;

	if (key == this.nextPanelKeyCode)
		this.showNextPanel();
	else /* if (key == this.previousPanelKeyCode) */
		this.showPreviousPanel();

	if (e.preventDefault) e.preventDefault();
	else e.returnValue = false;
	if (e.stopPropagation) e.stopPropagation();
	else e.cancelBubble = true;

	return false;
};

XPCH.Sliding.prototype.attachBehaviors = function()
{
	var ele = this.element;
	if (!ele)
		return;

	if (this.enableKeyboardNavigation)
	{
		var focusEle = null;
		var tabIndexAttr = ele.attributes.getNamedItem("tabindex");
		if (tabIndexAttr || ele.nodeName.toLowerCase() == "a")
			focusEle = ele;
	
		if (focusEle)
		{
			var self = this;
			XPCH.Sliding.addEventListener(focusEle, "focus", function(e) { return self.onFocus(e || window.event); }, false);
			XPCH.Sliding.addEventListener(focusEle, "blur", function(e) { return self.onBlur(e || window.event); }, false);
			XPCH.Sliding.addEventListener(focusEle, "keydown", function(e) { return self.onKeyDown(e || window.event); }, false);
		}
		if(this.autoPlay){
			var self_ = this;
			XPCH.Sliding.addEventListener(ele, "mouseover", function(e) { return self_.stopAutoSliding = true;}, false);
			XPCH.Sliding.addEventListener(ele, "mouseout", function(e) { return self_.stopAutoSliding = false;}, false);
		}
	}

	if (this.currentPanel)
	{
		// Temporarily turn off animation when showing the
		// initial panel.

		var ea = this.enableAnimation;
		this.enableAnimation = false;
		this.showPanel(this.currentPanel);
		this.enableAnimation = ea;
	}
};

XPCH.Sliding.prototype.getElement = function(ele)
{
	if (ele && typeof ele == "string")
		return document.getElementById(ele);
	return ele;
};

XPCH.Sliding.prototype.addClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) != -1))
		return;
	ele.className += (ele.className ? " " : "") + className;
};

XPCH.Sliding.prototype.removeClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) == -1))
		return;
	ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), "");
};

XPCH.Sliding.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
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

XPCH.Sliding.prototype.getElementChildren = function(element)
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

XPCH.Sliding.prototype.getCurrentPanel = function()
{
	return this.currentPanel;
};

XPCH.Sliding.prototype.getContentGroup = function()
{
	return this.getElementChildren(this.element)[0];
};

XPCH.Sliding.prototype.getContentPanels = function()
{
	return this.getElementChildren(this.getContentGroup());
};

XPCH.Sliding.prototype.getContentPanelsCount = function()
{
	return this.panels.length;
};

XPCH.Sliding.onloadDidFire = false;
XPCH.Sliding.loadQueue = [];

XPCH.Sliding.addLoadListener = function(handler)
{
	if (typeof window.addEventListener != 'undefined')
		window.addEventListener('load', handler, false);
	else if (typeof document.addEventListener != 'undefined')
		document.addEventListener('load', handler, false);
	else if (typeof window.attachEvent != 'undefined')
		window.attachEvent('onload', handler);
};

XPCH.Sliding.processLoadQueue = function(handler)
{
	XPCH.Sliding.onloadDidFire = true;
	var q = XPCH.Sliding.loadQueue;
	var qlen = q.length;
	for (var i = 0; i < qlen; i++)
		q[i].attachBehaviors();
};

XPCH.Sliding.addLoadListener(XPCH.Sliding.processLoadQueue);

XPCH.Sliding.addEventListener = function(element, eventType, handler, capture)
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

XPCH.Sliding.prototype.getContentPanelIndex = function(ele)
{
	if (ele)
	{
		ele = this.getElement(ele);
		var panels = this.panels;
		var numPanels = panels.length;
		for (var i = 0; i < numPanels; i++)
		{
			if (panels[i] == ele)
				return i;
		}
	}
	return -1;
};
XPCH.Sliding.prototype.showPanel = function(elementOrIndex,autoOrEvent)
{
	if(!autoOrEvent && this.autoPlay && this.stopAutoSliding) return;
	var pIndex = -1;
	
	if (typeof elementOrIndex == "number")
		pIndex = elementOrIndex;
	else // Must be the element for the content panel.
		pIndex = this.getContentPanelIndex(elementOrIndex);

	var numPanels = this.panelsCount;
	if (numPanels > 0)
		pIndex = (pIndex >= numPanels) ? numPanels - 1 : pIndex;
	else
		pIndex = 0;

	var panel = this.panels[pIndex];
	var contentGroup = this.getContentGroup();

	if (panel && contentGroup)
	{
		if (this.currentPanel)
			this.removeClassName(this.currentPanel, this.currentPanelClass);
		this.currentPanel = panel;

		var nx = -panel.offsetLeft;
		var ny = -panel.offsetTop;

		if (this.enableAnimation)
		{
			if (this.animator)
				this.animator.stop();
			var cx = contentGroup.offsetLeft;
			var cy = contentGroup.offsetTop;
			if (cx != nx || cy != ny)
			{
				var self = this;
				this.addClassName(this.element, this.animatingClass);
				this.animator = new XPCH.Sliding.PanelAnimator(contentGroup, cx, cy, nx, ny, { duration: this.duration, fps: this.fps, transition: this.transition, finish: function()
				{
					self.removeClassName(self.element, self.animatingClass);
					self.addClassName(panel, self.currentPanelClass);
				} });
				this.animator.start();
			}
		}else{
			contentGroup.style.left = nx + "px";
			contentGroup.style.top = ny + "px";
			this.addClassName(panel, this.currentPanelClass);
		}
	}

	return panel;
};

XPCH.Sliding.prototype.showFirstPanel = function(autoOrEvent)
{
	return this.showPanel(0,autoOrEvent);
};

XPCH.Sliding.prototype.showLastPanel = function(autoOrEvent)
{
	return this.showPanel((this.panels.length - 1),autoOrEvent);
};

XPCH.Sliding.prototype.showPreviousPanel = function(autoOrEvent)
{
	var currentNum = this.getContentPanelIndex(this.currentPanel),
		numPanels = this.panelsCount;

	if((currentNum - this.scrollCellCount) < 0){
		return this.showFirstPanel(autoOrEvent);
	}
	return this.showPanel((this.getContentPanelIndex(this.currentPanel) - this.scrollCellCount),autoOrEvent);
};

XPCH.Sliding.prototype.showNextPanel = function(autoOrEvent)
{	
	var currentNum = this.getContentPanelIndex(this.currentPanel),
		numPanels = this.panelsCount;
		
	if(this.lastReturnStart && (currentNum + this.scrollCellCount) == numPanels && this.loopable){
		return this.showPanel(0,autoOrEvent);
	}else if((currentNum + this.scrollCellCount) == numPanels && !this.loopable){
		return
	}
	return this.showPanel((currentNum + this.scrollCellCount),autoOrEvent);
};

XPCH.Sliding.PanelAnimator = function(ele, curX, curY, dstX, dstY, opts)
{
	this.element = ele;

	this.curX = curX;
	this.curY = curY;
	this.dstX = dstX;
	this.dstY = dstY;
	this.fps = 60;
	this.duration = 500;
	this.transition = XPCH.Sliding.PanelAnimator.defaultTransition;
	this.startTime = 0;
	this.timerID = 0;
	this.finish = null;

	var self = this;
	this.intervalFunc = function() { self.step(); };
	
	XPCH.Sliding.setOptions(this, opts, true);

	this.interval = 1000/this.fps;
};

XPCH.Sliding.PanelAnimator.defaultTransition = function(time, begin, finish, duration) { time /= duration; return begin + ((2 - time) * time * finish); };

XPCH.Sliding.PanelAnimator.prototype.start = function()
{
	this.stop();
	this.startTime = (new Date()).getTime();
	this.timerID = setTimeout(this.intervalFunc, this.interval);
};

XPCH.Sliding.PanelAnimator.prototype.stop = function()
{
	if (this.timerID)
		clearTimeout(this.timerID);
	this.timerID = 0;
};

XPCH.Sliding.PanelAnimator.prototype.step = function()
{
	var elapsedTime = (new Date()).getTime() - this.startTime;
	var done = elapsedTime >= this.duration;
	var x, y;

	if (done)
	{
		x = this.curX = this.dstX;
		y = this.curY = this.dstY;
	}
	else
	{
		x = this.transition(elapsedTime, this.curX, this.dstX - this.curX, this.duration);
		y = this.transition(elapsedTime, this.curY, this.dstY - this.curY, this.duration);
	}

	this.element.style.left = x + "px";
	this.element.style.top = y + "px";

	if (!done)
		this.timerID = setTimeout(this.intervalFunc, this.interval);
	else if (this.finish)
		this.finish();
};

