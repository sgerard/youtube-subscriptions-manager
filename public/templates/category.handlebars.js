(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['category'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "                    <img class=\"media-object\" src=\""
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "\"/>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"well well-sm category\" data-id=\""
    + alias4(((helper = (helper = helpers.categoryId || (depth0 != null ? depth0.categoryId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"categoryId","hash":{},"data":data}) : helper)))
    + "\">\r\n    <li class=\"media\">\r\n        <div class=\"media-left\">\r\n            <div class=\"thumbnails\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.thumbnailUrls : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\r\n        </div>\r\n\r\n        <div class=\"media-body\">\r\n            <div class=\"row\">\r\n                <div class=\"col-md-8\">\r\n                    <h4 class=\"media-heading\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h4>\r\n                </div>\r\n                <div class=\"col-md-4 text-right extras\">\r\n                    <a class=\"btn btn-default btn-xs edit-category\" href=\"#\">\r\n                        <i class=\"fa fa-pencil\"></i>\r\n                    </a>\r\n                    <a class=\"btn btn-default btn-xs delete-category\" href=\"#\">\r\n                        <i class=\"fa fa-trash\"></i>\r\n                    </a>\r\n                </div>\r\n            </div>\r\n            <div class=\"channelsInfo row\">\r\n                <div class=\"col-md-6\">\r\n                    <span class=\"channelCount\">"
    + alias4(((helper = (helper = helpers.channelCount || (depth0 != null ? depth0.channelCount : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"channelCount","hash":{},"data":data}) : helper)))
    + "</span> channels\r\n                    (<span class=\"videoCount\">"
    + alias4(((helper = (helper = helpers.videoCount || (depth0 != null ? depth0.videoCount : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"videoCount","hash":{},"data":data}) : helper)))
    + "</span> new videos)\r\n                </div>\r\n                <div class=\"col-md-6 text-right\">\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </li>\r\n</div>\r\n";
},"useData":true});
})();