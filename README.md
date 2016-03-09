# Youtube Subscriptions Manager

YSM is a web application that helps you sort your Youtube subscriptions in your
own categories. This feature was once present on Youtube but has been deprecated.

Check it live on https://dayth.com/services/youtube/

## Installation

Rename 'config/auth-example.js' as 'config/auth.js' and update its content with
your own values. You need to replace '&lt;your-client-id&gt;', '&lt;<your-client-secret&gt;'
and '&lt;your-server-url&gt;'

Rename 'views/ga-example.jade' as 'views/ga.jade' and update its content with
your own values. You need to replace '&lt;your-tracking-id&gt;'

Install the dependencies needed by the web application with:

```bash
npm install
```

Launch the web application with:
```bash
node bin/www
```

## Usage

### Categories

YSM allows you to create any number of categories. You can rename them or delete
them. To add a subscription to a category, you must first click on the category
summary in order to display its subscriptions. Then, you can drag and drop your
subscriptions on the white panel. Each category summary displays the number of
subscriptions and new videos inside it.

### Subscriptions

You can go on the Youtube channel linked to the subscription by clicking on its
thumbnail or the Youtube play button in the subscription summary. If you click
on a subscription summary in the category's subscriptions panel, the list of the
last videos that Youtube estimate you have not watched will be displayed. If you
click on the video's thumbnail, you will be redirected to the video on Youtube.
