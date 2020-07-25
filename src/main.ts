// https://github.com/actions/toolkit
import * as core from "@actions/core";
import { context } from "@actions/github";

import * as c from "./core";
// import { Webhooks } from "@octokit/webhooks";
// Webhooks.WebhookPayloadPush

async function run(): Promise<void> {
  try {
    const jwtToken: string = core.getInput("notification-token");
    const jobStatus: string = core.getInput("job-status");

    const botToken: string = core.getInput("bot-token");
    const chatId: string = core.getInput("chat-id");

    // validation
    // TODO also make sure chatId is a number string
    if (jwtToken) {
      if (botToken || chatId) {
        core.warning(
          "bot-token and chat-id are ignored when notification-token is presented"
        );
      }
    } else if (!botToken || !chatId) {
      throw new Error(
        "bot-token and chat-id are required when notification-token is not presented"
      );
    }

    // https://docs.github.com/en/actions/reference/events-that-trigger-workflows#about-workflow-events

    await c.run(botToken, jwtToken, chatId, context, jobStatus);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
