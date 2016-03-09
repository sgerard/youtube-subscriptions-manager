(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['subscription'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"well well-sm subscription\" data-id=\""
    + alias4(((helper = (helper = helpers.channelId || (depth0 != null ? depth0.channelId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"channelId","hash":{},"data":data}) : helper)))
    + "\">\r\n    <li class=\"media\">\r\n        <div class=\"media-left\">\r\n            <a target=\"_blank\" href=\"https://www.youtube.com/channel/"
    + alias4(((helper = (helper = helpers.channelId || (depth0 != null ? depth0.channelId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"channelId","hash":{},"data":data}) : helper)))
    + "/videos\">\r\n            <img class=\"media-object\" src=\""
    + alias4(((helper = (helper = helpers.thumbnailUrl || (depth0 != null ? depth0.thumbnailUrl : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"thumbnailUrl","hash":{},"data":data}) : helper)))
    + "\" alt=\""
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "\"/>\r\n            </a>\r\n        </div>\r\n\r\n        <div class=\"media-body\">\r\n            <div class=\"row\">\r\n                <div class=\"col-md-6\">\r\n                    <h4 class=\"media-heading\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h4>\r\n                </div>\r\n                <div class=\"col-md-6 text-right extras\">\r\n                    <i class=\"category-count\" data-toggle=\"tooltip\"></i>\r\n                    <a target=\"_blank\" class=\"btn btn-default btn-xs open-subscription\" href=\"https://www.youtube.com/channel/"
    + alias4(((helper = (helper = helpers.channelId || (depth0 != null ? depth0.channelId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"channelId","hash":{},"data":data}) : helper)))
    + "/videos\">\r\n                        <i class=\"fa fa-youtube-play\"></i>\r\n                    </a>\r\n                </div>\r\n            </div>\r\n            <div class=\"videosInfo row\">\r\n                <div class=\"col-md-6\">\r\n                    "
    + alias4(((helper = (helper = helpers.totalItemCount || (depth0 != null ? depth0.totalItemCount : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"totalItemCount","hash":{},"data":data}) : helper)))
    + " videos ("
    + alias4(((helper = (helper = helpers.newItemCount || (depth0 != null ? depth0.newItemCount : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"newItemCount","hash":{},"data":data}) : helper)))
    + " new)\r\n                </div>\r\n                <div class=\"col-md-6 text-right\">\r\n                    Subscribed "
    + alias4(((helper = (helper = helpers.subscriptionDate || (depth0 != null ? depth0.subscriptionDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"subscriptionDate","hash":{},"data":data}) : helper)))
    + "\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </li>\r\n</div>\r\n";
},"useData":true});
})();