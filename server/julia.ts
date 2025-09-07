import { spawn } from "child_process";
import path from "path";

const jlPath = path.resolve(process.cwd(), "server/julia/my_file.jl");

export function startJulia(modelPath: string, port = 9000) {
  const jl = JSON.stringify(jlPath);           // safe quoting
  const model = JSON.stringify(modelPath);     // safe quoting
  const juliaCode = `
    include(${jl});
    ENV["HOST"] = "127.0.0.1";
    ENV["PORT"] = string(${port});
    start_api_server(${model});
  `;

  const proc = spawn("julia", ["--project=.", "-e", juliaCode], {
    stdio: "inherit",
    env: process.env,
  });

  proc.on("error", (err) => {
    console.error("Julia spawn error:", err);
  }); // child_process error event [22]

  const cleanup = () => proc.kill();
  process.on("exit", cleanup);
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup); // process signals [23]

  return proc;
}
