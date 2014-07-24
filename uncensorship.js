var Nodewhal = require('nodewhal'),
    defaultTaskInterval = 3000,
    config = require('./config'),
    latestReportedTime = null,
    redditBase = 'http://reddit.com',
    bot = Nodewhal(config.userAgent);

function reportAction(action) {
  return bot.byId(action.target_fullname).then(function(post) {
    return bot.submit(
      config.subreddit, 'link', post.title, redditBase + post.permalink, true
    ).then(function(reportPost) {
      return bot.flair(
        config.subreddit, reportPost.name, action.action, action.mod + '@' + action.subreddit
      );
    });
  });
}

bot.login(config.username, config.password).then(function(bot) {
  return Nodewhal.schedule.repeat(function() {
    return bot.moderated().then(function(subs) {
      return subs.map(function(sub) {return sub.display_name;}).filter(function(name) {
        return name !== config.subreddit;
      });
    }).then(function(subreddits) {
      return bot.modlog(subreddits.join('+')).then(function(actions) {
        return actions.reverse();
      }).then(function(actions) {
        return actions.filter(function(action) {
          return ((
            config.reportActions || ['approvelink', 'removelink']
          ).indexOf(action.action) !== -1);
        });
      }).then(function(actions) {
        return actions.filter(function(action) {
          return (config.excludeMods || []).indexOf(action.mod) === -1;
        });
      });
    }).then(function(actions) {
      if (!actions.length) {return;}
      return Nodewhal.schedule.runInSeries(actions.map(function(action) {
        if (!latestReportedTime || action.created_utc > latestReportedTime) {
          latestReportedTime = action.created_utc;
          return reportAction(action);
        }
      }));
    });
  }, config.taskInterval || defaultTaskInterval);
}).then(undefined, function(error) {
  console.error('error', error.stack || error);
});
