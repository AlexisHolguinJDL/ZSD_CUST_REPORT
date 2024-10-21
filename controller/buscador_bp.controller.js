sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
    "./utilities",
    "idom/fiori/cust/report/model/formatter"
    ], function(BaseController, MessageBox, History,Utilities,formatter) {
    "use strict";

    return BaseController.extend("idom.fiori.cust.report.controller.buscador_bp", {
    	formatter: formatter,
    	handleRouteMatched: function (oEvent) {
            		
		var oParams = {}; 
		
		if (oEvent.mParameters.data.context) { 
		    this.sContext = oEvent.mParameters.data.context;
		    var oPath; 
		    if (this.sContext) { 
		        oPath = {path: "/" + this.sContext, parameters: oParams}; 
		        this.getView().bindObject(oPath);
		    } 
		};
		
		//Hide basic search
		var oBuscador = this.getView().byId("ListReportFilterBar");
		oBuscador._oBasicSearchFieldContainer.setVisible(false)
		
		//Set dummy filter (only it will be executed when the app is opened)	
		var oHistory = sap.ui.core.routing.History.getInstance();
		if(oHistory.aHistory.length < 2 )
			Utilities.dummyFilterBP(this,"ListaBP");		
		
        },
        onCountryChange: function(oEvent){
			// when the selectedItem is null, it is shown nothing
			var sPropertyValueToFilter = ( oEvent.getParameter("selectedItem") ) ? oEvent.getParameter("selectedItem").getKey() : "";
			Utilities.filterDependingProperty(this, sPropertyValueToFilter, "Country",'comboRegion');        	
        },
        onIndustrySystemChange: function(oEvent){
			// when the selectedItem is null, it is shown nothing
			var sPropertyValueToFilter = ( oEvent.getParameter("selectedItem") ) ? oEvent.getParameter("selectedItem").getKey() : "";
			Utilities.filterDependingProperty(this, sPropertyValueToFilter, "sys_industry",'comboIndustry');        	
        },
        
		_onSearchField: function(oEvent){
			var sSearchValue = oEvent.getParameter("query");
			//Convert accent values
			sSearchValue=Utilities.convertCharacters(sSearchValue);
			//Search and bind items (with filters)
			var aFilterValues = [];
			//Get filter values
			aFilterValues = Utilities.getFilterValuesBP(this);
			//Bind items (with filter)
			Utilities.filterBP(this,aFilterValues,sSearchValue,"ListaBP");  			
		},
		_onSearch: function(oEvent){
			//this line was write because the search button should work in the same way as button GO 
			var sSearchValue = this.getView().byId("selSearch").getValue();
			if(sSearchValue===null)sSearchValue="";
			//Search and bind items (with filters)
			var aFilterValues = [];
			//Get filter values
			aFilterValues = Utilities.getFilterValuesBP(this);
			//Bind items (with filter)
			Utilities.filterBP(this,aFilterValues,sSearchValue,"ListaBP");   
		},        
        
_onFioriListReportTableItemPress: function (oEvent) {
            		
		var oBindingContext = oEvent.getParameter("listItem").getBindingContext(); 
		
		return new Promise(function(fnResolve) {
		    this.doNavigate("visualizar_bp", oBindingContext, fnResolve, "");
		}.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});
		
        },
doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
            		
		var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
		var oModel = (oBindingContext) ? oBindingContext.getModel() : null;
		
		var sEntityNameSet;
		if (sPath !== null && sPath !== "") {
		    if (sPath.substring(0, 1) === "/") {
		        sPath = sPath.substring(1);
		    }
		    sEntityNameSet = sPath.split("(")[0];
		}
		var sNavigationPropertyName;
		var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;
		
		if (sEntityNameSet !== null) {
		    sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
		}
		if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
		    if (sNavigationPropertyName === "") {
		        this.oRouter.navTo(sRouteName, {
		            context: sPath,
		            masterContext: sMasterContext
		        }, false);
		    } else {
		        oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
		            if (bindingContext) {
		                sPath = bindingContext.getPath();
		                if (sPath.substring(0, 1) === "/") {
		                    sPath = sPath.substring(1);
		                }
		            }
		            else {
		                sPath = "undefined";
		            }
		
		            // If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
		            if (sPath === "undefined") {
		                this.oRouter.navTo(sRouteName);
		            } else {
		                this.oRouter.navTo(sRouteName, {
		                    context: sPath,
		                    masterContext: sMasterContext
		                }, false);
		            }
		        }.bind(this));
		    }
		} else {
		    this.oRouter.navTo(sRouteName);
		}
		
		if (typeof fnPromiseResolve === "function") {
		    fnPromiseResolve();
		}
        },
_onFioriListReportTableUpdateFinished: function (oEvent) {
            		
		var oTable = oEvent.getSource();
		var oHeaderbar = oTable.getAggregation("headerToolbar");
		if (oHeaderbar && oHeaderbar.getAggregation("content")[1]) {
		    var oTitle = oHeaderbar.getAggregation("content")[1];
		    if (oTable.getBinding("items") && oTable.getBinding("items").isLengthFinal()) {
		        oTitle.setText("("+ oTable.getBinding("items").getLength() + ")");
		    } else {
		        oTitle.setText("(1)");
		    }
		}
        },
onInit: function () {
            		
        this.mBindingOptions = {};
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this.oRouter.getTarget("buscador_bp").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
        this.oFilterBar = null;
        this.oFilterBar = this.getView().byId("ListReportFilterBar");
        var oBasicSearch = new sap.m.SearchField({
            showSearchButton: true
        });
        this.oFilterBar.setBasicSearch(oBasicSearch);

        }
});
}, /* bExport= */true);
