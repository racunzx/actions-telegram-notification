# actions-telegram-notification

![build-test](https://github.com/haishanh/actions-telegram-notification/workflows/build-test/badge.svg)

This action send a notification about your action runs.

<p style="height:0;overflow:hidden;padding-top:55%;positive:relative;">
  <img style="position:absolute;top:0;left:0;bottom:0;right:0;" alt="Telegram Notification Screenshots" src="https://user-images.githubusercontent.com/1166872/88460933-67506f00-ced2-11ea-9cbb-4919ff88497a.jpg">
</p>

## Usage

See [action.yml](action.yml)

Basic:

```yaml
- uses: haishanh/actions-telegram-notification@v1
  with:
    notification-token: ${{ secrets.NOTIFICATION_TOKEN }}
    job-status: ${{ job.status }}
```

You can obtain a `NOTIFICATION_TOKEN` by sending the command `/token` to the [GitHub Actions Notification bot](https://t.me/ghactionsbot). After you get the token, goto your repo "Settings" page, select "Secrets" and add it as a secret environment variables there.

Note that GitHub Actions Notification bot is not a GitHub official one, the source code of the bot API is [here](https://github.com/haishanh/vercel-telegram). And it's running on [vercel](https://vercel.com/).
