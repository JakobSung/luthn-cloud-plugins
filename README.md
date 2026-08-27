# Luthn Cloud plugins

This repository is the official distribution marketplace for the Luthn Cloud
0.1 plugins for Codex and Claude Code.

The package contains only declarative plugin metadata, a remote MCP connection,
and read-only usage guidance. It does not contain the Luthn Cloud service,
private Cloud agents, credentials, customer data, or operational configuration.

## Install for Codex

```sh
codex plugin marketplace add https://github.com/JakobSung/luthn-cloud-plugins
codex plugin add luthn-cloud@luthn
```

## Install for Claude Code

```sh
claude plugin marketplace add https://github.com/JakobSung/luthn-cloud-plugins
claude plugin install luthn-cloud@luthn
```

The first use opens browser authorization for the selected Luthn workspace. The
0.1 plugin can search policy-approved safe team summaries and inspect workspace
status. It cannot retrieve protected originals or automatically capture agent
conversations.

## Security

Do not report credentials or customer content in a public issue. Use the support
channel published at <https://app.luthn.com/> for security-sensitive reports.
