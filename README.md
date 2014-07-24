# uncensorship

Reddit bot that posts public moderation logs by serving as a moderator of monitored subreddits.

Original implementation by /u/sunshine-x rewritten using Nodewhal by /u/go1dfish


## Instructions

    git clone https://github.com/go1dfish/uncensorship.git
    cd uncensorship
    cp config.json.example config.json
    edit config.json # add your username/password and subreddit
    npm install
    npm start

The bot will automatically report removals/approvals for any sub it is a moderator of other than the report subreddit itself.


### Known issues

Restarting the bot can result in duplicate posts
