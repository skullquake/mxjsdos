require(
        {
		packages:[
			{
				name:'jsdos',
				location:'/widgets/mxjsdos/lib/js-dos',
				main:'js-dos'
			}
		]
	},
	[
		"dojo/_base/declare",
		"mxui/widget/_WidgetBase",
		"dijit/_TemplatedMixin",
		"mxui/dom",
		"dojo/dom",
		"dojo/dom-prop",
		"dojo/dom-geometry",
		"dojo/dom-class",
		"dojo/dom-style",
		"dojo/dom-construct",
		"dojo/_base/array",
		"dojo/_base/lang",
		"dojo/text",
		"dojo/html",
		"dojo/_base/event",
		"mxjsdos/lib/jquery-1.11.2",
		"jsdos",
		"dojo/text!mxjsdos/widget/template/mxjsdos.html"
	],
	function(
		declare,
		_WidgetBase,
		_TemplatedMixin,
		dom,
		dojoDom,
		dojoProp,
		dojoGeometry,
		dojoClass,
		dojoStyle,
		dojoConstruct,
		dojoArray,
		lang,
		dojoText,
		dojoHtml,
		dojoEvent,
		_jQuery,
		_Dos,
		widgetTemplate
	){
		"use strict";
		var $ = _jQuery.noConflict(true);
		return declare(
			"mxjsdos.widget.mxjsdos",
			[
				_WidgetBase,
				_TemplatedMixin
			],
			{
				templateString: widgetTemplate,
				widgetBase: null,
				_handles: null,
				_contextObj: null,
				canvas:null,
				running:false,
				constructor: function () {
					this._handles = [];
				},
				postCreate: function(){
				},
				update: function (obj, callback) {
					this._contextObj = obj;
					if((!this.running)&&this._contextObj!=null){
						var url="/file?guid="+this._contextObj.getGuid();
						Dos(
							this.canvas,
							{ 
								wdosboxUrl: "/widgets/mxjsdos/lib/js-dos/wdosbox.js" 
							}
						)
						.ready(
							(fs,main)=>{
								fs.createFile(
									"dosbox.conf",
									`[autoexec]\r\n'+
									'mount c .\r\n'+
									'c:\r\n'+
									'type dosbox~1.con\r\n`
								);
								fs.createFile(
									"foo.bar",
									`foo\r\nbar\r\n`
								);
								fs.extract(
									//"/widgets/mxjsdos/lib/js-dos/digger.zip"
									url
								).then(
									()=>{
										var flags=[];//(["-c","DIGGER.COM"])//array of dosbox flags
										main(flags).then((ci) => {
											//ci.exit(); // Will stop execution immediately
											require(['dojo/topic'],function(topic){topic.publish('dGrowl','Dosbox Started',{});});
											//ci.simulateKeyPress(37); // left arrow
										});
									}
								);
							}
						);
					}else{
					}
					this._updateRendering(callback);
				},
				resize: function (box) {
				},
				uninitialize: function () {
				},
				_updateRendering: function (callback) {
					if (this._contextObj !== null) {
						//dojoStyle.set(this.domNode, "display", "block");
					} else {
						//dojoStyle.set(this.domNode, "display", "none");
					}
					this._executeCallback(callback, "_updateRendering");
				},
				_execMf: function (mf, guid, cb) {
					if (mf && guid) {
						mx.ui.action(mf, {
							params: {
								applyto: "selection",
								guids: [guid]
							},
							callback: lang.hitch(this, function (objs) {
								if (cb && typeof cb === "function") {
									cb(objs);
								}
							}),
							error: function (error) {
								console.debug(error.description);
							}
						}, this);
					}
				},
				_executeCallback: function (cb, from) {
					if (cb && typeof cb === "function") {
						cb();
					}
				}
			}
		);
	}
);
//require(["mxjsdos/widget/mxjsdos"]);
