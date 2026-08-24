import { createServer } from "node:http";

const port = 18081;
let state = "ready";
const healthRequests = [];

function sendJson(response, status, body) {
  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (url.pathname === "/__test__/state") {
    const nextState = url.searchParams.get("state");
    if (!["ready", "unavailable", "slow"].includes(nextState)) {
      sendJson(response, 400, { error: "Invalid fixture state." });
      return;
    }
    state = nextState;
    healthRequests.length = 0;
    sendJson(response, 200, { state });
    return;
  }

  if (url.pathname === "/__test__/requests") {
    sendJson(response, 200, { requests: healthRequests });
    return;
  }

  if (request.method !== "GET" || url.pathname !== "/health/ready") {
    sendJson(response, 404, { error: "Not found." });
    return;
  }

  healthRequests.push(url.pathname);
  if (state === "slow") await new Promise((resolve) => setTimeout(resolve, 300));

  if (state === "ready") {
    sendJson(response, 200, { status: "ready" });
    return;
  }
  sendJson(response, 503, {
    error: { code: "dependency_unavailable", message: "A dependency is unavailable." },
  });
});

server.listen(port, "127.0.0.1");
