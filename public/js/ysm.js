var Settings = (function() {

    function Settings() {
        // options
        this.visibilityOptions = ['show-all', 'show-uncategorized'];
        this.sortOptions = ['alphabetical', 'videoCount'];

        // values
        this.visibility = this.visibilityOptions[0];
        this.sort = this.sortOptions[0];
    };

    Settings.prototype.update = function(data) {
        var settingsChanged = false;

        settingsChanged |= this.checkSetting('visibility', data);
        settingsChanged |= this.checkSetting('sort', data);

        if (settingsChanged) {
            helper.refresh();
        }
    };

    Settings.prototype.checkSetting = function(name, data) {
        if (data[name] != this[name]) {
            this[name] = data[name];
            return true;
        } else {
            return false;
        }
    };

    return Settings;
})();

var Subscription = (function() {
    function Subscription(data) {
        var snippet = data.snippet;
        var contentDetails = data.contentDetails;

        this.channelId = snippet.resourceId.channelId;
        this.thumbnailUrl = snippet.thumbnails.default.url;
        this.title = snippet.title;
        this.totalItemCount = contentDetails.totalItemCount;
        this.newItemCount = contentDetails.newItemCount;
        this.subscriptionDate = moment(snippet.publishedAt).fromNow();
        this.categories = [];
        this.categoryCount = 0;
    };

    Subscription.prototype.addCategory = function(categoryId) {
        this.categories.push(categoryId);
        this.categoryCount++;
    };

    Subscription.prototype.removeCategory = function(categoryId) {
        var index = this.categories.indexOf(categoryId);
        if (index > -1) {
            this.categories.splice(index, 1);
            this.categoryCount--;
        }
    };

    return Subscription;
})();

var Category = (function() {
    function Category(data) {
        this.categoryId = data._id;
        this.name = data.name;
        this.channels = data.channels;
        this.channelCount = data.channels.length;
        this.videoCount = 0;
        for (var i = 0; i < data.channels.length; i++) {
            var channelId = data.channels[i];
            var channel = helper.ysm.subscriptions[channelId];
            this.videoCount += channel.newItemCount;
            channel.addCategory(this.categoryId);
        }
    };

    Category.prototype.addSubscription = function(channelId) {
        this.channels.push(channelId);
        this.channelCount++;
        this.videoCount += helper.ysm.subscriptions[channelId].newItemCount;
    };

    Category.prototype.removeSubscription = function(channelId) {
        var index = this.channels.indexOf(channelId);
        if (index > -1) {
            this.channels.splice(index, 1);
            this.channelCount--;
            this.videoCount -= helper.ysm.subscriptions[channelId].newItemCount;
        }
    };

    return Category;
})();

var Ysm = (function() {
    function Ysm() {
        this.subscriptions = {};
        this.categories = {};
    };

    Ysm.prototype.addSubscription = function(data) {
        var subscription = new Subscription(data);
        this.subscriptions[subscription.channelId] = subscription;
        return subscription;
    };

    Ysm.prototype.addCategory = function(data) {
        var category = new Category(data);
        this.categories[category.categoryId] = category;
        return category;
    };

    Ysm.prototype.editCategory = function(categoryId, name) {
        this.categories[categoryId].name = name;
    };

    Ysm.prototype.addSubscriptionToCategory = function(categoryId, channelId) {
        this.categories[categoryId].addSubscription(channelId);
        this.subscriptions[channelId].addCategory(categoryId);
    };

    Ysm.prototype.removeSubscriptionFromCategory = function(categoryId, channelId) {
        this.categories[categoryId].removeSubscription(channelId);
        this.subscriptions[channelId].removeCategory(categoryId);
    };

    Ysm.prototype.removeCategory = function(categoryId) {
        delete this.categories[categoryId];
    };

    return Ysm;
})();

var helper = (function() {

    this.ysm = null;
    this.settings = null;

    return {
    initYsm: function() {
        this.ysm = new Ysm();
    },

    initSettings: function() {
        this.settings = new Settings();
    },

    addSubscription: function(data) {
        var html = Handlebars.templates.subscription(data);
        $('#subscriptions ul.media-list').append(html);
    },

    getThumbnailUrls: function(category) {
        var thumbnailUrls = [];
        for (var i = 0; i < 4; i++) {
            if (i < category.channelCount) {
                var channelId = category.channels[i];
                var subscription = helper.getSubscription(channelId);
                thumbnailUrls.push(subscription.thumbnailUrl);
            } else {
                '/img/transparent.png';
            }
        }
        category.thumbnailUrls = thumbnailUrls;
    },

    addCategory: function(data) {
        helper.getThumbnailUrls(data);

        var html = Handlebars.templates.category(data);
        var item = $(html).hide();
        $('.category.well', '.category-list ul.media-list')
            .add(item.fadeIn(800))
            .sort(helper.sortAlphaCategory)
            .appendTo($('.category-list ul.media-list'));
    },

    removeLoading: function(div) {
        div.find('.loading').remove();
        div.find('.media-list').css('display', 'block');
    },

    initSubscriptions: function(pageToken) {
        $.getJSON('api/ysm/subscriptions', function(response) {
            if (response.error) {
                console.log(response.error);
            } else {
                var subscriptions = response;
                if (subscriptions) {
                    helper.removeLoading($('#subscriptions'));
                    helper.initSlick();
                    $.each(subscriptions, function(index, data) {
                        var subscription = helper.ysm.addSubscription(data);
                        helper.addSubscription(subscription);
                    });
                    helper.initCategories();
                }
            }
        });
    },

    customizeSubscriptions: function() {
        $("#subscriptions.subscription-list").mCustomScrollbar({
            theme:"light-thick",
            scrollButtons: {
                enable: true
            },
            live: true,
            alwaysShowScrollbar: true
        });
        $("#sortedSubscriptions.subscription-list").mCustomScrollbar({
            theme:"dark-thick",
            scrollButtons: {
                enable: true
            },
            live: true,
            alwaysShowScrollbar: true
        });
        $(".video-list").mCustomScrollbar({
            theme:"dark-thick",
            scrollButtons: {
                enable: true
            },
            live: true,
            alwaysShowScrollbar: true
        });
        $("#subscriptions .well").draggable({
            revert: "invalid",
            cancel: "a.channel",
            helper: "clone",
            cursor: 'move',
            opacity: 0.8,
            stack: "#authOps",
            zIndex: 100,
            appendTo: "body",
            start: function(event, ui) {
                ui.helper.width($(event.target).width());
            }
        });

        $(document).on('click', '.category-subscriptions .subscription', function() {
            var channelId = helper.getSubscriptionId($(this));
            helper.displayChannel(channelId);
            helper.loadChannel(channelId);
        });

        $(document).on('mouseenter mouseleave', '.subscription.well', function() {
            $(this).find('.extras').fadeToggle();
        });

        $(document).on('click', '.delete-subscription', function() {
            helper.removeSubscriptionFromCategory($(this).parents('.subscription'));
        });

        $('[data-toggle="tooltip"]').tooltip({
            container: 'body',
            delay: { 'show': 500, 'hide': 100 },
            placement: 'top auto',
            html: true,
            title: function() {
                var channelId = $(this).parents('.subscription').attr('data-id');
                var subscription = helper.getSubscription(channelId);
                var categoryNames = [];
                $.each(subscription.categories, function(index, categoryId) {
                    var category = helper.getCategory(categoryId);
                    categoryNames.push(category.name);
                });
                var tooltipText = categoryNames.join('</br>');
                return tooltipText;
            }
        });

        $.each(helper.ysm.subscriptions, function(channelId, subscription) {
            if (subscription.categoryCount > 0) {
                helper.updateSubscription(subscription.channelId);
            }
        });
    },

    initDroppable: function() {
        $('#sortedSubscriptions').droppable({
            accept: '#subscriptions .well',
            tolerance: 'pointer',
            activeClass: 'ui-state-highlight',
            drop: function(event, ui) {
                helper.addSubscriptionToCategory(ui.draggable);
            }
        });
    },

    initSlick: function() {
        $('.tabs').slick({
            dots: false,
            infinite: false,
            speed: 300,
            slidesToShow: 1,
            slidesToScroll: 1,
            //centerMode: false,
            variableWidth: false,
            //adaptativeHeight: true,
            arrows: true,
            draggable: false,
            swipe: false,
            touchMove: false
        });
        $('.slick-slide').show();
    },

    initHandlebars: function() {
        Handlebars.registerHelper('if_eq', function(a, b, opts) {
            if (a == b) {
                return opts.fn(this);
            } else {
                return opts.inverse(this);
            }
        });
    },

    saveSettings: function() {
        $('#settingsModal').modal('hide');
        var form = $('#settingsModal form');
        var data = {
            visibility: $(form).find('input[name="visibilityOptions"]:checked').val(),
            sort: $(form).find('input[name="sortOptions"]:checked').val()
        };
        helper.settings.update(data);
    },

    submitCategory: function() {
        $('#categoryModal').modal('hide');
        var role = $('#categoryModal').data('role');
        if (role == 'create') {
            helper.createCategory($('#category').val());
        } else {
            var categoryId = $('#categoryModal').attr('data-id');
            helper.editCategory(categoryId, $('#category').val());
        }
    },

    initModal: function() {
        $('.modal').modal({backdrop: 'static', show: false});

        // category modal
        $('#categoryModal').on('show.bs.modal', function () {
            var role = $('#categoryModal').data('role');
            if (role == 'create') {
                $('input#category').val('');
                $('#categoryModal .modal-title').text('Create category');
            } else {
                $('#categoryModal .modal-title').text('Edit category');
                var categoryId = $('#categoryModal').attr('data-id');
                var name = helper.getCategoryName(categoryId);
                $('input#category').val(name);
            }
        });
        $('#categoryModal').on('shown.bs.modal', function () {
            $('input#category').focus();
        });
        $('#categoryModal #submitCategory').click(helper.submitCategory);
        //$('#categoryModal form').submit(submitCategory);

        // settings modal
        $(document).on('click', 'a.settings', function() {
            $('#settingsModal').modal('show');
        });
        $('#settingsModal #saveSettings').click(helper.saveSettings);
    },

    initCategories: function() {

        $.getJSON('api/ysm/category', function(response) {
            if (response.error) {
                console.log(response.error);
            } else {
                var categories = response.categories;
                if (categories) {
                    helper.removeLoading($('.tabs'));
                    $.each(categories, function(index, data) {
                        var category = helper.ysm.addCategory(data);
                        helper.addCategory(category);
                    });
                    helper.customizeCategories();
                    helper.customizeSubscriptions();
                }
            }
        });
    },

    customizeCategories: function() {
        $(".category-list").mCustomScrollbar({
            theme:"light-thick",
            scrollButtons: {
                enable: true
            },
            live: true,
            alwaysShowScrollbar: true
        });

        $(document).on('click', '.create-category', function() {
            helper.preCreateCategory();
        });

        $(document).on('click', '.delete-category', function(evt) {
            var categoryId = helper.getCategoryId($(this).parents('.category'));
            helper.removeCategory(categoryId);
            evt.stopPropagation();
        });

        $(document).on('click', '.edit-category', function(evt) {
            var categoryId = helper.getCategoryId($(this).parents('.category'));
            helper.preEditCategory(categoryId);
            evt.stopPropagation();
        });

        $(document).on('click', '.category-list .category', function() {
            var categoryId = helper.getCategoryId($(this));
            helper.displayCategory(categoryId);
            helper.loadCategory(categoryId);
        });

        $(document).on('mouseenter mouseleave', '.category.well', function() {
            $(this).find('.extras').fadeToggle();
        });
    },

    getCategory: function(categoryId) {
        return helper.ysm.categories[categoryId];
    },

    getCategoryId: function(categoryItem) {
        return categoryItem.attr('data-id');
    },

    getCategoryItem: function(categoryId) {
        return $('.category[data-id="' + categoryId + '"]');
    },

    getCategoryName: function(categoryId) {
        return helper.getCategory(categoryId).name;
    },

    setCurrentCategory: function(categoryId) {
        $('.category-subscriptions #categoryName').attr('data-id', categoryId);
    },

    getCurrentCategory: function() {
        var categoryId = $('.category-subscriptions #categoryName').attr('data-id');
        return helper.getCategory(categoryId);
    },

    updateCurrentCategory: function() {
        var category = helper.getCurrentCategory();
        var categoryItem = helper.getCategoryItem(category.categoryId);
        categoryItem.find('.videoCount').text(category.videoCount);
        categoryItem.find('.channelCount').text(category.channelCount);
        helper.getThumbnailUrls(category);
        var html = '';
        $.each(category.thumbnailUrls, function(index, thumbnailUrl) {
            html += '<img class="media-object" src="' + thumbnailUrl + '"/>';
        });
        categoryItem.find('.thumbnails').html(html);
    },

    preCreateCategory: function() {
        $('#categoryModal').data('role', 'create');
        $('#categoryModal').modal('show');
    },

    createCategory: function(name) {
        //console.log("Create category: " + name);

        $.ajax({
            url: 'api/ysm/category',
            type: 'POST',
            data: {
                name: name
            },
            success: function(response) {
                if (response.error) {
                    console.log(response.error);
                } else {
                    var category = helper.ysm.addCategory(response.category);
                    helper.addCategory(category);
                    helper.displayCategory(category.categoryId);
                }
            }
        });
    },

    removeCategory: function(categoryId) {
        $.ajax({
            url: 'api/ysm/category',
            type: 'DELETE',
            data: {
                categoryId: categoryId
            },
            success: function(response) {
                if (response.error) {
                    console.log(response.error);
                } else {
                    helper.ysm.removeCategory(categoryId);
                    var item = helper.getCategoryItem(categoryId);
                    item.remove();
                }
            }
        });
    },

    preEditCategory: function(categoryId) {
        $('#categoryModal').attr('data-id', categoryId);
        $('#categoryModal').data('role', 'edit');
        $('#categoryModal').modal('show');
    },

    editCategory: function(categoryId, name) {
        $.ajax({
            url: 'api/ysm/category',
            data: {
                categoryId: categoryId,
                name: name
            },
            type: 'PUT',
            success: function(response) {
                if (response.error) {
                    console.log(response.error);
                } else {
                    var item = helper.getCategoryItem(categoryId);
                    item.find('h4').text(name);
                    helper.ysm.editCategory(categoryId, name);
                }
            }
        });
    },

    displayCategory: function(categoryId) {
        var name = helper.getCategoryName(categoryId);
        $("#categoryName").text(name);
        helper.setCurrentCategory(categoryId);
        $("#sortedSubscriptions ul.media-list").empty();
        $('.tabs').slick('slickGoTo', 1);

        $('#subscriptions .well').each(function(index) {
            helper.enableSubscription($(this));
        });
    },

    loadCategory: function(categoryId) {
        var channels = helper.getCategory(categoryId).channels;
        if (channels) {
            $.each(channels, function(index, channelId) {
                var item = helper.getSubscriptionItem(channelId, false);
                helper.selectSubscription(item);
            });
        }
        /*
        var data = {
            category: category
        };
        $.getJSON('api/ysm/subscription', data, function(response) {
            if (response.error) {
                console.log(response.error);
            } else {
                var subscriptions = response.subscriptions;
                if (subscriptions) {
                    $.each(subscriptions, function(index, channelId) {
                        var item = helper.getSubscription(channelId);
                        helper.selectSubscription(item);
                    });
                }
            }
        });
        */
    },

    getSubscription: function(channelId) {
        return helper.ysm.subscriptions[channelId];
    },

    getSubscriptionId: function(subscriptionItem) {
        return subscriptionItem.attr('data-id');
    },

    getSubscriptionItem: function(channelId, withClone) {
        var selector = '.well[data-id="' + channelId + '"]';
        if (!withClone) {
            selector = '#subscriptions ' + selector;
        }
        return $(selector);
    },

    updateSubscription: function(channelId) {
        var subscription = helper.getSubscription(channelId);
        var subscriptionItem = helper.getSubscriptionItem(channelId, true);
        var count = subscription.categoryCount;
        var text = '';
        if (count > 0) {
            text += count + ' categor';
            text += count > 1 ? 'ies' : 'y';
            if (helper.settings.visibility == 'show-uncategorized') {
                helper.getSubscriptionItem(channelId, false).hide();
            }
        } else {
            subscriptionItem.show();
        }

        subscriptionItem.find('.category-count').text(text);
    },

    selectSubscription: function(item) {
        var clonedItem = item.clone().hide();
        clonedItem.toggleClass('ui-draggable ui-draggable-handle')
        helper.disableSubscription(item);

        var trashHtml = Handlebars.templates.trashButton();
        clonedItem.find('.extras').append(trashHtml);

        var sortMethod = helper.sortAlphaSubscription;
        if (helper.settings.sort == 'videoCount') {
            sortMethod = helper.sortVideoCount;
        }

        $('.subscription.well', '#sortedSubscriptions ul.media-list')
            .add(clonedItem.fadeIn(800))
            .sort(sortMethod)
            .appendTo($('#sortedSubscriptions ul.media-list'));
    },

    addSubscriptionToCategory: function(item) {

        var categoryId = helper.getCurrentCategory().categoryId;
        var channelId = item.data('id');

        $.ajax({
            url: 'api/ysm/subscription',
            type: 'POST',
            data: {
                categoryId: categoryId,
                channelId: channelId
            },
            success: function(response) {
                if (response.error) {
                    console.log(response.error);
                } else {
                    helper.selectSubscription(item);
                    helper.ysm.addSubscriptionToCategory(categoryId, channelId);
                    helper.updateCurrentCategory();
                    helper.updateSubscription(channelId);
                }
            }
        });
    },

    removeSubscriptionFromCategory: function(clonedItem) {
        var categoryId = helper.getCurrentCategory().categoryId;
        var channelId = clonedItem.data('id');

        $.ajax({
            url: 'api/ysm/subscription',
            type: 'DELETE',
            data: {
                categoryId: categoryId,
                channelId: channelId
            },
            success: function(response) {
                if (response.error) {
                    console.log(response.error);
                } else {
                    clonedItem.remove();
                    var item = helper.getSubscriptionItem(channelId, false);
                    helper.enableSubscription(item);
                    helper.ysm.removeSubscriptionFromCategory(categoryId, channelId);
                    helper.updateCurrentCategory();
                    helper.updateSubscription(channelId);
                }
            }
        });
    },

    enableSubscription: function(item) {
        item
            .removeClass('disabled')
            .draggable('enable');

        if (helper.settings.visibility == 'show-all') {

        } else if (helper.settings.visibility == 'show-uncategorized') {
            var channelId = helper.getSubscriptionId(item);
            helper.updateSubscription(channelId);
        }
    },

    disableSubscription: function(item) {
        item
            .addClass('disabled')
            .draggable('disable');

        if (helper.settings.visibility == 'show-all') {

        } else if (helper.settings.visibility == 'show-uncategorized') {
            var channelId = helper.getSubscriptionId(item);
            helper.updateSubscription(channelId);
        }
    },


    setCurrentChannel: function(channelId) {
        $('.subscription-videos #channelTitle').attr('data-id', channelId);
    },

    displayChannel: function(channelId) {
        var title = helper.getSubscription(channelId).title;
        $("#channelTitle").text(title);
        helper.setCurrentChannel(channelId);
        $(".video-list .video-previews").empty();
        $('.tabs').slick('slickGoTo', 2);
    },

    loadChannel: function(channelId) {
        //console.log("Loading channel: " + channelId);
        var subscription = helper.getSubscription(channelId);
        $.getJSON('api/ysm/videos', {channelId: channelId, videoCount: subscription.newItemCount}, function(response) {
            if (response.error) {
                console.log(response.error);
            } else {
                var videos = response;
                if (videos) {
                    //console.log(videos);
                    $.each(videos, function(index, data) {
                        helper.addVideo(data);
                    });

                }
            }
        });
    },

    addVideo: function(data) {
        var snippet = data.snippet;
        var templateData = {
            title: snippet.title,
            thumbnailUrl: snippet.thumbnails.medium.url,
            videoId: snippet.resourceId.videoId,
            publicationDate: moment(snippet.publishedAt).fromNow()
        };
        var html = Handlebars.templates.video(templateData);
        $('.video-list .video-previews').append(html);
    },

    refresh: function() {
        console.log('refresh', helper.settings);
        if (helper.settings.visibility == 'show-all') {
            $('#subscriptions .well').show();
        } else if (helper.settings.visibility == 'show-uncategorized') {
            $.each(helper.ysm.subscriptions, function(channelId, subscription) {
                if (subscription.categoryCount > 0) {
                    helper.updateSubscription(channelId);
                }
            });
        }

        var sortMethod = helper.sortAlphaSubscription;
        if (helper.settings.sort == 'videoCount') {
            sortMethod = helper.sortVideoCount;
        }
        $('#sortedSubscriptions ul.media-list')
            .find(".subscription")
            .sort(sortMethod)
            .each(function(index, el) {
                $(el).parent().append(el);
            });
    },

    sortAlphaCategory: function(a, b) {
        var category1 = helper.getCategory($(a).attr('data-id'));
        var category2 = helper.getCategory($(b).attr('data-id'));

        var name1 = category1.name.toLowerCase();
        var name2 = category2.name.toLowerCase();

        return name1 > name2 ? 1 : -1;
    },

    sortAlphaSubscription: function(a, b) {
        var subscription1 = helper.getSubscription($(a).attr('data-id'));
        var subscription2 = helper.getSubscription($(b).attr('data-id'));

        var title1 = subscription1.title.toLowerCase();
        var title2 = subscription2.title.toLowerCase();

        return title1 > title2 ? 1 : -1;
    },

    sortVideoCount: function(a, b) {
        var subscription1 = helper.getSubscription($(a).attr('data-id'));
        var subscription2 = helper.getSubscription($(b).attr('data-id'));

        var title1 = subscription1.title.toLowerCase();
        var title2 = subscription2.title.toLowerCase();

        var videoCount1 = subscription1.newItemCount;
        var videoCount2 = subscription2.newItemCount;

        var result = (videoCount1 < videoCount2
            || (videoCount1 == videoCount2 && title1 > title2));
        return result ? 1 : -1;
    }

    };
})();

$(document).ready(function() {
    helper.initYsm();
    helper.initSettings();
    helper.initDroppable();
    helper.initModal();
    helper.initHandlebars();
    helper.initSubscriptions();
});
