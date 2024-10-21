sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "./utilities",
    "sap/ui/core/routing/History",
    "idom/fiori/cust/report/model/formatter"
    ], function(BaseController, MessageBox, Utilities, History,formatter) {
    "use strict";

    return BaseController.extend("idom.fiori.cust.report.controller.visualizar_bp", {
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
		}
		
		var sPartner="";
		// if the entity is binded, get the property
		if(this.getView().getBindingContext() && this.getView().getBindingContext().getProperty())
			sPartner=this.getView().getBindingContext().getProperty("partner");
		
		this._filterPartnerElements([
                                     new sap.ui.model.Filter(
                                             "sold_to_party", 
                                             sap.ui.model.FilterOperator.Contains, 
                                             sPartner)  
                                     ]);
		
        },

_onFilterElements: function(oEvent){
	var oTable = this.getView().byId("Partners");
	var aContexts = oTable.getSelectedContexts();
	var aFilter = [];
	var oBindingContext = this.getView().getBindingContext();
	var sPartner=oBindingContext.getProperty("partner");	
	aFilter.push(new sap.ui.model.Filter(
            								"sold_to_party", 
            								sap.ui.model.FilterOperator.Contains, 
            								sPartner
            							 )
				);
	var i=0;
	for(i=0;i<aContexts.length;i++){
		var sPartner=aContexts[i].getProperty("related_partner");
		aFilter.push(new sap.ui.model.Filter(
				"sold_to_party", 
				sap.ui.model.FilterOperator.Contains, 
				sPartner
			 )
		);
	};	
	this._filterPartnerElements(aFilter);
}, 
/**
 * Item press on proposal table: navigate to View Proposal
 */
_onProposalPress: function(oEvent){
	var oListItem = oEvent.getParameter("listItem");
	var oBindingContext = oListItem.getBindingContext();
	var sProposal=oBindingContext.getProperty("propcode");
	sProposal=(sProposal) ? sProposal.replace("/","%252f") : sProposal;
	var sVersion=oBindingContext.getProperty("propversion");
	// mandatory for navigating to Proposal App
	var sDraftUUID="00000000-0000-0000-0000-000000000000";
	var oTarget= {
					semanticObject: "ZSD_PROPOSAL",
					action: "display"
	};
	var oParams = {};
	var sInternalNav="&/view_offer/zsd_c_prop(DraftUUID=guid'"+sDraftUUID+"',PropCode='"+sProposal+"',PropVersion='"+sVersion+"')";
	this._navigateToExternalApp(oTarget, oParams, sInternalNav);
},
/**
 * Item press on Opportunity table 
 */
_onOpportunityPress: function(oEvent){
	var oListItem = oEvent.getParameter("listItem");
	var oBindingContext = oListItem.getBindingContext();
	var sBOCode=oBindingContext.getProperty("bo_code");	
	// mandatory for navigating to Proposal App
	var sDraftUUID="00000000-0000-0000-0000-000000000000";
	var oTarget= {
					semanticObject: "ZSD_BUSINESS_OPPORTUNITY",
					action: "display"
	};
	var oParams = {};
	var sInternalNav="&/visualizar_oportunidad/ZSD_C_BOP(DraftUUID=guid'"+sDraftUUID+"',bo_code='"+sBOCode+"')";
	this._navigateToExternalApp(oTarget, oParams, sInternalNav);
},

/**
 * Navigate to external App
 */
_navigateToExternalApp: function( oTarget, oParams, sInternalNav)
{
	  var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
	  var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
		  				target: oTarget,
		  				params : oParams // optionally
	  })) || ""; // generate the Hash to display a Supplier
	 
	  var url= window.location.href.split('#')[0] + hash + sInternalNav;
	  sap.m.URLHelper.redirect(url, true);
},


/**
 * Item press on Project table 
 */
_onProjectPress: function(oEvent){
	var oListItem = oEvent.getParameter("listItem");
	var oBindingContext = oListItem.getBindingContext();
	var sProjectURL=oBindingContext.getProperty("ProjectURL");	
	window.open(sProjectURL,"_blank");
},

/**
 * Item press on Partner table 
 */
_onRelatedPartnersPress:function(oEvent){
	var oListItem = oEvent.getParameter("listItem");
	var oBindingContext = oListItem.getBindingContext();
	var sPartner=oBindingContext.getProperty("related_partner");
	var sPath = "ZSD_C_BP('"+sPartner+"')";
	// get the entity before to navigate
	var that=this;
	var oModel=this.getView().getModel();
	var mParameters={};
	mParameters.success=function(oData){
		that.oRouter.navTo("visualizar_bp", {
			context: sPath,
			masterContext: sPath
		}, false);	
	};
	oModel.read("/"+sPath,mParameters);	
},
_filterPartnerElements: function(aFilter){
	var oFilter = new sap.ui.model.Filter({
											 filters: aFilter,
											 and: false
										   });
	this.getView().byId("BusinessOpportunities").getBinding("items").filter(oFilter);	
	this.getView().byId("Proposals").getBinding("items").filter(oFilter);	
	this.getView().byId("Projects").getBinding("items").filter(oFilter);
},        
_onFioriObjectPageHeaderPress: function () {
            		
		var oHistory = History.getInstance();
		var sPreviousHash = oHistory.getPreviousHash();
		var oQueryParams = this.getQueryParameters(window.location);
		
		if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
		    window.history.go(-1);
		} else {
		    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		    oRouter.navTo("default", true);
		}
        },
getQueryParameters: function (oLocation) {
            		
		var oQuery = {};
		var aParams = oLocation.search.substring(1).split("&");
		for (var i = 0; i < aParams.length; i++) {
		    var aPair = aParams[i].split("=");
		    oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
		}
		return oQuery;
		
        },
onInit: function () {
            		
        this.mBindingOptions = {};
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this.oRouter.getTarget("visualizar_bp").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

        },
   /*If it's employee tax data can not be shown */
   formatterHideEmployee: function(isEmployee){
	   return !isEmployee;   
   }
});
}, /* bExport= */true);
