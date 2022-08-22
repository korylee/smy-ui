#!/usr/bin/env node
import { Command } from "commander";
import { build } from "./commands/build";
import { compile } from "./commands/compile";
import { dev } from "./commands/dev";
import { preview } from "./commands/preview";
import { CLI_PACKAGE_JSON } from "./shared/constant";
import logger from "./shared/logger";

const program = new Command();

program.version(`smy-cli ${require(CLI_PACKAGE_JSON).version}`).usage("<command> [options]");

program.command("compile").description("Compile Smy components library code").action(compile);

program.command("build").description("Build site for production").action(build);

program.command("preview").description("Preview site or production").action(preview);

program
  .command("dev")
  .option("-f --force", "Force dep pre-optimization regardless of whether deps have changed")
  .description("Run development enviroment")
  .action(dev);

program.on("command:*", ([cwd]) => {
  program.outputHelp();
  logger.error(`\nUnknown command ${cwd}.\n`);
  process.exitCode = 1;
});

program.parse();
