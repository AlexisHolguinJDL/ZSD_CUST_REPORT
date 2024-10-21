sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"idom/fiori/cust/report/model/models"
    ], function(UIComponent, Device, models) {
    	"use strict";
        
    	
	var navigationWithContext = {
		"ZSD_C_BP": {
		"visualizar_bp": ""
	}
	};

	return UIComponent.extend("idom.fiori.cust.report.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// set the FLP model
			this.setModel(models.createFLPModel(), "FLP");
			
			// set the dataSource model
			this.setModel(new sap.ui.model.json.JSONModel({"uri":"/sap/opu/odata/sap/ZSD_BP_ODATA_SRV"}), "dataSource");
			

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			
			// Setting the start date in the datepickers on monday.
			sap.ui.core.LocaleData.getInstance(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale()).mData["weekData-firstDay"] = 1;
			
			// create the views based on the url/hash
			this.getRouter().initialize();
		},

		createContent: function() {
			var app = new sap.m.App({
				id: "App"
			});
			var appType = "App";
			var appBackgroundColor = "";
			if (appType === "App" && appBackgroundColor) {
				app.setBackgroundColor(appBackgroundColor);
			}

			return app;
		},

		getNavigationPropertyForNavigationWithContext: function(sEntityNameSet, targetPageName) {
			var entityNavigations = navigationWithContext[sEntityNameSet];
			return entityNavigations == null ? null : entityNavigations[targetPageName];
		}
	});

});
