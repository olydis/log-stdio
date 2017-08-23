import { ChildProcess, exec } from "child_process";

async function main() {
  const args = process.argv.slice(2);
  const log: (channel: string, data: string) => void =
    (channel, data) => console.error(JSON.stringify({ channel, data }, null, 2));
  const waitForCompletion = new Promise<number>(res => {
    const cp = exec(
      args.join(" "),
      (err: any) => res(err && typeof err.code === "number" ? err.code : 0));
    // forward
    process.stdin.pipe(cp.stdin);
    cp.stdout.pipe(process.stdout);
    cp.stderr.pipe(process.stderr);
    // log
    process.stdin.on("data", chunk => log("stdin", chunk.toString()));
    cp.stdout.on("data", chunk => log("stdout", chunk.toString()));
    cp.stderr.on("data", chunk => log("stderr", chunk.toString()));
  });
  process.exit(await waitForCompletion);
}

main();