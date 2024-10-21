sap.ui.define([
    "./utilities"
], function() {
	"use strict";

    // class providing static utility methods to retrieve entity default values.

	return {
		/**
		 * Dummy filter for Search BP Page to avoid
		 * initial selection of data
		 * To be called in HandleRoutedMatched of each page
		 */
		dummyFilterBP: function(oThatPage,sTableId){
			//Set dummy filter	
			oThatPage.getView().byId(sTableId).getBinding("items").filter([
	                                                                  new sap.ui.model.Filter(
	                                                                          "partner", 
	                                                                          "EQ", 
	                                                                          "XXXXXXXXXX")  
	                                                          ]);			
		},		
		convertCharacters: function(sString)
		{
			var sValue=sString.toLowerCase();
			var sLetter=[];
			sLetter.push(["á","%C3%A1"]);
			sLetter.push(["é","%C3%A9"]);
			sLetter.push(["ó","%C3%B3"]);
			sLetter.push(["ú","%C3%BA"]);
			sLetter.push(["í","%C3%AD"]);
			for(var i=0;i<sLetter.length;i++)
			{
				sValue=sValue.replace(sLetter[i][0],sLetter[i][1]);
			}
			
			return sValue;
		},
		filterBP: function(oThatPage,aFiltersFields,sSearchValue,sTableId){
			   var sNavPath = "/ZSD_C_BP";
			   var oTable    = oThatPage.getView().byId(sTableId);
			   var oFilterDraft;
			   var aFilters = [];		   
			   aFilters=aFiltersFields;
			   //Search value
			   var oBinding=oTable.getBinding("items");
			   if(sSearchValue!==null&&sSearchValue!==""){	
				   	//force the replace method to replace all of concurrences
				   	sSearchValue="*"+sSearchValue.replace(/ /g,"*")+"*";
					oBinding.sCustomParams="search="+sSearchValue;
			   }else{
				   	oBinding.sCustomParams="";
			   };
			   oBinding.filter(aFilters);				   
			   
		},

			/**
			 * Filter a property which depends on others
			 * -sValuesToFilter: array or string of values for filtering
			 * -PropertyDepending: array or string of Properties for filtering
			 * -sComboId: id of the element to filter
			 */
		filterDependingProperty: function(oThatPage, aValuesToFilter, aPropertyDependingToFilter, sComboId)
		{
				var aPropertyDepending=[];
				var aValues=[];
				// checking if the function receive a string or array
				if(typeof aValuesToFilter==="string" && typeof aPropertyDependingToFilter==="string")
				{
					aPropertyDepending.push(aPropertyDependingToFilter);
					aValues.push(aValuesToFilter);
				}
				else
				{
					aPropertyDepending=aPropertyDependingToFilter;
					aValues=aValuesToFilter;
				}
				// setting the filters to be created
				var iNumFilters=Math.min(aValues.length, aPropertyDepending.length);
				var oFilter;
				var aFilters = [];
				//filtering
				for(var i=0; (i < iNumFilters);i++)
				{
					oFilter=new sap.ui.model.Filter(aPropertyDepending[i], sap.ui.model.FilterOperator.EQ, aValues[i])
					aFilters.push(oFilter);
				}
				oThatPage.getView().byId(sComboId).getBinding("items").filter(aFilters);
				
		},
		/**
         * Get Filter Array for Business Partners
         */
		getFilterValuesBP: function(oThatPage){
			var aFilter = [];
			var sFilterOperator;
			
			this._addTextInputFilter(oThatPage,"partner","selPartner",aFilter);
			this._addTextInputFilter(oThatPage,"partnerName","selName",aFilter);
			this._addTextInputFilter(oThatPage,"city","selCity",aFilter);
			this._addTextInputFilter(oThatPage,"post_code","selPostalCode",aFilter);
			this._addTextInputFilter(oThatPage,"post_code","selPostalCode",aFilter);
			this._addTextInputFilter(oThatPage,"partnertax","selTaxNumber",aFilter);
			this._addTextInputFilter(oThatPage,"search","selSearchCode",aFilter);
			//Filter Equals
			sFilterOperator=sap.ui.model.FilterOperator.EQ;
			this._addComboBoxFilter(oThatPage,"country_code","comboCountry",aFilter, sFilterOperator);
			this._addComboBoxFilter(oThatPage,"region_code","comboRegion",aFilter, sFilterOperator);
			this._addComboBoxFilter(oThatPage,"tax_type","comboTaxCategory",aFilter, sFilterOperator);
			//MultiComboBoxes
			this._addMultiComboBoxFilter(oThatPage,"to_Roles/Roles","comboRoles",aFilter,sap.ui.model.FilterOperator.Contains);			
			this._addComboBoxFilter(oThatPage,"system_code","comboIndustrySystem",aFilter,sap.ui.model.FilterOperator.EQ);
			this._addMultiComboBoxFilter(oThatPage,"sector_code","comboIndustry",aFilter,sap.ui.model.FilterOperator.EQ);
			//this._addMultiComboBoxFilter(oThatPage,"legalenty_code","comboLegalForm",aFilter,sap.ui.model.FilterOperator.EQ);
			this._addMultiComboBoxFilter(oThatPage,"custom_clas_code","comboCustomerClasification",aFilter,sap.ui.model.FilterOperator.EQ);
			this._addMultiComboBoxFilter(oThatPage,"industy_code","comboIndustryCode",aFilter,sap.ui.model.FilterOperator.EQ);
			return aFilter;
		},	
		/**
		 * Function to add values to a filter from a MultiComboBox
		 * sProperty: property to filter
		 * sId: id of the element in the view
		 * aFilter: array of filters to use
		 */
		_addMultiComboBoxFilter: function(oThatPage,sProperty,sId,aFilter, sFilterOperator){
			var oCombo = oThatPage.getView().byId(sId);
			var aKeys  = oCombo.getSelectedKeys();
			for(var i=0;i<aKeys.length;i++){
				aFilter.push( new sap.ui.model.Filter(sProperty,sFilterOperator,aKeys[i]));
			};
		},
		/**
		 * Function to add values to a filter from a ComboBox
		 * sProperty: property to filter
		 * sId: id of the element in the view
		 * aFilter: array of filters to use
		 */
		_addComboBoxFilter: function(oThatPage,sProperty,sId,aFilter, sFilterOperator){
			var oCombo = oThatPage.getView().byId(sId);
			var sKey  = oCombo.getSelectedKey();
			if(sKey!==null&&sKey!==""){
				aFilter.push( new sap.ui.model.Filter(sProperty,sFilterOperator,sKey));
			}		
		},		
		
		/**
		 * Function to add values to a filter from a InputField
		 * sProperty: property to filter
		 * sId: id of the element in the view
		 * aFilter: array of filters to use
		 */		
		_addTextInputFilter: function(oThatPage,sProperty,sId,aFilter){
			var sValue = oThatPage.getView().byId(sId).getValue();
			if(sValue){
				aFilter.push( new sap.ui.model.Filter(sProperty,sap.ui.model.FilterOperator.Contains,sValue));
			}
		},
		/**
		 * Function to add values to a filter from a InputField
		 * sProperty: property to filter
		 * sId: id of the element in the view
		 * aFilter: array of filters to use
		 */		
		_addTextInputEqualsFilter: function(oThatPage,sProperty,sId,aFilter){
			var sValue = oThatPage.getView().byId(sId).getValue();
			if(sValue){
				aFilter.push( new sap.ui.model.Filter(sProperty,sap.ui.model.FilterOperator.EQ,sValue));
			}
		},			
	};
});
