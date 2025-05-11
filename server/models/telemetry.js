const { v4 } = require("uuid");
const { SystemSettings } = require("./systemSettings");

const Telemetry = {

  connect: async function () {
    const client = this.client();
    const distinctId = await this.findOrCreateId();
    return { client, distinctId };
  },

  isDev: function () {
    return process.env.NODE_ENV === "development" && this.stubDevelopmentEvents;
  },

  client: function () {
    if (process.env.DISABLE_TELEMETRY === "true" || this.isDev()) return null;
    const { PostHog } = require("posthog-node");
    return new PostHog(this.pubkey);
  },

  runtime: function () {
    if (process.env.ANYTHING_LLM_RUNTIME === "docker") return "docker";
    if (process.env.NODE_ENV === "production") return "production";
    return "other";
  },

  sendTelemetry: async function (
    event,
    eventProperties = {},
    subUserId = null,
    silent = false
  ) {
  },

  flush: async function () {
    const client = this.client();
    if (!client) return;
    await client.shutdownAsync();
  },
};

module.exports = { Telemetry };
