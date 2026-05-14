import { spawn } from "node:child_process";

const commands = [
  {
    name: "backend",
    command: process.execPath,
    args: ["backend/server.mjs"],
  },
  {
    name: "vite",
    command: process.execPath,
    args: ["node_modules/vite/bin/vite.js"],
  },
];

const children = [];
let shuttingDown = false;

function start({ name, command, args }) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: process.env,
    shell: false,
    stdio: ["inherit", "pipe", "pipe"],
  });

  children.push(child);

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[${name}] ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[${name}] ${chunk}`);
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    stopAll();
    const reason = signal ? `signal ${signal}` : `code ${code}`;
    console.error(`[dev] ${name} exited with ${reason}`);
    process.exit(code ?? 1);
  });
}

function stopAll() {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

process.on("SIGINT", () => {
  shuttingDown = true;
  stopAll();
});

process.on("SIGTERM", () => {
  shuttingDown = true;
  stopAll();
});

for (const command of commands) {
  start(command);
}
