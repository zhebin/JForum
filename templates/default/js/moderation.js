function verifyModerationCheckedTopics()
{
	var f = document.formModeration.topic_id;
	
	if (f.length == undefined)	 {
		if (f.checked) {
			return true;
		}
	}

	for (var i = 0; i < f.length; i++) {
		if (f[i].checked) {
			return true;
		}
	}
	
	alert("${I18n.getMessage("Moderation.SelectTopics")}");
	return false;
}

function validateModerationDelete()
{
	var status = verifyModerationCheckedTopics()
		&& confirm("${I18n.getMessage("Moderation.ConfirmDelete")}");

	if (status) {
		document.formModeration.log_type.value = "1";
	}

	return status;
}

function stickynotsticky()
{
	var status = verifyModerationCheckedTopics();

	if (status) {
		document.formModeration.log_type.value = "4";
	}

	return status;
}

function lockUnlock() 
{
	var status = verifyModerationCheckedTopics();
	
	if (status) {
		document.formModeration.log_type.value = "3";
	}

	return status;
}

var oldClasses = {}

function changeTrClass(from, trIndex)
{
	var tr = from.parentNode.parentNode;
	trIndex = trIndex.toString();

	if (from.checked) {
		tr.className = "moderation_highlight";
		oldClasses[trIndex] = new Array();

		for (var i = 0; i < tr.childNodes.length; i++) {
			var node = tr.childNodes[i];

			if (node.nodeName.toUpperCase() == "TD") {
				oldClasses[trIndex].push(node.className);
				node.className = "";
			}
		}
	}
	else {
		tr.className = "";

		for (var i = tr.childNodes.length - 1; i >= 0; i--) {
			var node = tr.childNodes[i];

			if (node.nodeName.toUpperCase() == "TD") {
				node.className = oldClasses[trIndex].pop();
			}
		}
	}	
}