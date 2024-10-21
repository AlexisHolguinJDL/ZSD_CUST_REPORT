sap.ui.define([],
function() 
{
"use strict";
return {
	hasValue : function(sValue) {
		var bHasValue=false;
		if(sValue!==null&&sValue!==""){
			bHasValue=true;
		}
		return bHasValue;
	},
	cutText : function(sValue)
	{
		var sNewValue=sValue;
		if(sValue && (sValue.length > 13))
		{
			sNewValue= sValue.slice(0,12);
			sNewValue+="...";
		}
		return sNewValue;
	},
};
});