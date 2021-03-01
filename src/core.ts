import { context } from "@actions/github";
import jwt from "jsonwebtoken";

import { TelegramService } from "./telegram";

// @actions/github type'd context already
type Context = typeof context;
type Ctx = Omit<Context, "issue" | "payload" | "runNumber" | "action">;

// https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#job-context
// type JobStatus = "success" | "failure" | "cancelled";

export async function run(
  botToken: string | null,
  jwtToken: string | undefined,
  inputChatId: string,
  context: Ctx,
  jobStatus: string
) {
  const tg = new TelegramService(botToken, jwtToken);

  let chatId = inputChatId;
  if (jwtToken) {
    const claims = jwt.decode(jwtToken) as { chatId: string };
    chatId = claims.chatId;
  }

  const text = composeMessageText(context, jobStatus);

  // await tg.sendMessage({
  //   chat_id: parseInt(chatId, 10),
  //   text,
  // });
  const photo = composePhotoUrl(context, jobStatus);
  await tg.sendPhoto({
    chat_id: parseInt(chatId, 10),
    caption: text,
    photo,
  });
}

function composePhotoUrl(context: Ctx, jobStatus: string | null): string {
  const { owner, repo } = context.repo;
  const p3 = jobStatus === "success" ? "0" : "1";
  return `https://imgsvc.vercel.app/image?w=360&h=180&u=0&p0=gha&p1=${owner}&p2=${repo}&p3=${p3}`;
}

// "eventName": "push",
// "sha": "acd0816c3dbae740ca163ebe5bfac4afed28d663",
// "ref": "refs/heads/master",
// "workflow": "build-test",
// "action": "self",
// "actor": "johndoe",
// "job": "build",
// "runNumber": 9,
// "runId": 178585234
function composeMessageText(context: Ctx, jobStatus: string | null): string {
  const { eventName, workflow, job, runId, actor, ref, sha } = context;
  const { owner, repo } = context.repo;
  const shortRef = ref.replace(/^refs\/heads\//, "");
  const shortSha = sha.slice(0, 7);
  const status = renderJobStatus(jobStatus);

  const a = escapeEntities(`${owner}/${repo}`);
  const shortRefE = escapeEntities(shortRef);
  const workflowE = escapeEntities(workflow);
  const jobE = escapeEntities(job);
  const actorE = escapeEntities(actor);
  const eventNameE = escapeEntities(eventName);
  const link = `https://github.com/${owner}/${repo}/actions/runs/${runId}`;

  const text = `
*${a}* ${shortRefE}\\(${shortSha}\\)

${workflowE} ${jobE} ${status}

Triggered by ${actorE} with a ${eventNameE} event

[View details](${link})
`;
  return text.trim();
}

// https://core.telegram.org/bots/api#markdownv2-style
// '_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'
const charsNeedEscape = "_*[]()~`>#+-=|{}.!";

function escapeEntities(input: string) {
  const len = input.length;
  let output = "";
  for (let i = 0; i < len; i++) {
    const c = input[i];
    if (charsNeedEscape.indexOf(c) >= 0) {
      output += "\\" + c;
    } else {
      output += c;
    }
  }
  return output;
}

function renderJobStatus(jobStatus: string | null) {
  if (!jobStatus) return "";

  if (jobStatus === "success") {
    return "success 🚀";
  } else if (jobStatus === "failure") {
    return "failed 🚨";
  } else {
    return jobStatus;
  }
}
