import path from "path";
import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";

const HELP = `
w3 build [options] [<web3api-manifest>]

Options:
  -h, --help                         Show usage information
  -i, --ipfs [<node>]                Upload build results to an IPFS node (default: dev-server's node)
  -o, --output-dir <path>            Output directory for build results (default: build/)
  -e, --test-ens <[address,]domain>  Publish the package to a test ENS domain locally (requires --ipfs)
  -w, --watch                        Automatically rebuild when changes are made (default: false)
  -v, --verbose                      Verbose output (default: false)
`;

describe("e2e tests for build command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["build", "--help"],
      cwd: projectRoot
    }, w3Cli);

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for invalid params - outputDir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["build", "--output-dir"],
      cwd: projectRoot
    }, w3Cli);

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--output-dir option missing <path> argument
${HELP}`);
  });

  test("Should throw error for invalid params - testEns", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["build", "--test-ens"],
      cwd: projectRoot
    }, w3Cli);

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--test-ens option missing <[address,]domain> argument
${HELP}`);
  });

  test("Should throw error for invalid params - ipfs", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["build", "--test-ens", "test.eth"],
      cwd: projectRoot
    }, w3Cli);

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--test-ens option requires the --ipfs [<node>] option
${HELP}`);
  });

  test("Should throw error for invalid web3api - invalid route", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["build", "invalid-web3api-1.yaml"],
      cwd: projectRoot
    }, w3Cli);

    const schemaPath = path.normalize(`${projectRoot}/src/wrong/schema.graphql`);

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(`ENOENT: no such file or directory, open '${schemaPath}'`);
  });

  test("Should throw error for invalid web3api - invalid field", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["build", "invalid-web3api-2.yaml"],
      cwd: projectRoot
    }, w3Cli);

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(`instance is not allowed to have the additional property \"wrong_mutation\"`);
  });

  test("Successfully build the project", async () => {
    const { exitCode: code, stdout: output } = await runCLI({
      args: ["build", "-v"],
      cwd: projectRoot
    }, w3Cli);

    const manifestPath = "build/web3api.yaml";
    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain("Artifacts written to ./build from the image `build-env`");
    expect(sanitizedOutput).toContain("Manifest written to ./build/web3api.yaml");
    expect(sanitizedOutput).toContain(manifestPath);
  });

  test("Successfully builds project w/ web3api.build.yaml but no dockerfile", async () => {
    const { exitCode: code, stdout: output } = await runCLI({
      args: ["build", "web3api.no-docker.yaml", "-v"],
      cwd: projectRoot
    }, w3Cli);

    const manifestPath = "build/web3api.yaml";
    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain("Artifacts written to ./build from the image `build-env`");
    expect(sanitizedOutput).toContain("Manifest written to ./build/web3api.yaml");
    expect(sanitizedOutput).toContain(manifestPath);
  });

  test("Successfully builds project w/ dockerfile", async () => {
    const { exitCode: code, stdout: output } = await runCLI({
      args: ["build", "web3api.docker.yaml", "-v"],
      cwd: projectRoot
    }, w3Cli);

    const manifestPath = "build/web3api.yaml";
    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain("Artifacts written to ./build from the image `build-env`");
    expect(sanitizedOutput).toContain("Manifest written to ./build/web3api.yaml");
    expect(sanitizedOutput).toContain(manifestPath);
  });

  test("Errors when dockerfile config property is missing", async () => {
    const { exitCode: code, stdout: output } = await runCLI({
      args: ["build", "web3api.wrong-config.yaml", "-v"],
      cwd: projectRoot
    }, w3Cli);

    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(1);
    expect(sanitizedOutput).toContain("Validation errors encountered while sanitizing BuildManifest");
    expect(sanitizedOutput).toContain("instance.config requires property \"include\"");
  });
});
