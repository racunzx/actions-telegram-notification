import dotenv from "dotenv";

import * as c from "./core";

dotenv.config();

const env = process.env;

const jwt = env.JWT;

(async () => {
  await c.run(
    null,
    jwt,
    "",
    {
      eventName: "push",
      workflow: "build-test",
      job: "build",
      runId: 178585234,
      actor: "haishanh",
      ref: "refs/heads/master",
      sha: "acd0816c3dbae740ca163ebe5bfac4afed28d663",
      repo: { owner: "facebook", repo: "react" },
    },
    // "success"
    "failure"
  );
})();
