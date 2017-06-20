#!/usr/bin/env node

/**
 * The child process wrapper functions for the trackertimer.
 * @namespace spawns
 * @author jmg1138 {@link https://github.com/jmg1138 jmg1138 on GitHub}
 */

/**
 * Invoke strict mode for the entire script.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode Strict mode}
 */
"use strict";

/**
 * Require the 3rd party modules that will be used.
 * @see {@link https://github.com/petkaantonov/bluebird bluebird}
 * @see {@link https://nodejs.org/api/child_process.html child process}
 */
const P = require("bluebird");
const spawn = require("child_process").spawn;

/**
 * Module to be exported, containing the spawn child process wrapper functions.
 */
const spawns = {

  /**
   * Child process spawner.
   * @param {Object} data An object containing the command and arguments-array
   * to be spawned.
   * @example
   * const spawns = require("./spawns.js");
   * spawns.spawner({
   *   "command": "echo",
   *   "argsArray": ["This is a test"]
   * });
   */
  spawner: data => {

    /**
     * Steps to spawn the child process.
     * Handle the case where data isn't defined, and then handle the case where
     * data.command isn't defined, and then spawn the process, and then handle
     * the process output.
     */
    return new P((resolve, reject) =>
      handleNoData(data)
        .then(data => handleNoCommand(data))
        .then(data => spawnTheCommand(data))
        .then(proc => handleProcessOutput(proc))
        .then(output => resolve(output))
        .catch(err => reject(err))
    );

    /**
     * Handle the case where data isn't defined.
     * Set the command and args to echo "No data provided" when spawned.
     * @param {Object} data
     */
    function handleNoData(data) {
      return new P(resolve => {
        if (!data) {
          data = {};
          data.command = "echo";
          data.argsArray = ["No data provided"];
        }
        resolve(data);
      });
    }

    /**
     * Handle the case where data.command isn't defined.
     * Set the command and args to echo "No data provided" when spawned.
     * @param {Object} data
     */
    function handleNoCommand(data) {
      return new P(resolve => {
        if (!data.command) {
          data.command = "echo";
          data.argsArray = ["No command provided"];
        }
        resolve(data);
      });
    }

    /**
     * Spawn the command, using arguments only if they were provided.
     * @param {Object} data
     */
    function spawnTheCommand(data) {
      return new P(resolve => {
        if (!data.argsArray) {
          resolve(spawn(data.command, [], {
            shell: true
          }));
        } else if (data.argsArray) {
          resolve(spawn(data.command, data.argsArray, {
            shell: true
          }));
        }
      });
    }

    /**
     * Handle the process output of the spawned child process.
     * @param {*} proc
     */
    function handleProcessOutput(proc) {
      return new P((resolve, reject) => {
        let count = 0;
        let output = {};
        proc.stdout.on("data", data => {
          let string = data.toString("utf8");
          let lines = string.split(/(\r?\n)/g);
          for (var i = 0; i < lines.length; i++) {
            if (lines[i] != "\r\n") {
              output[count] = lines[i];
              count++;
            }
          }
        });
        proc.stderr.on("data", data => reject(data));
        //proc.on("close", code => logOutput(`Closed with code ${code}`));
        //proc.on("exit", code => logOutput(`Exited with code ${code}`));
        proc.on("exit", () => resolve(output));
      });
    }

    /**
     * Log data to the console, after removing newlines.
     * @param {*} data
     */
    /*
    function logOutput(data) {
      data = data.toString("utf8").replace(/\n$/, ''); // Remove newlines
      console.log(data);
    }
    */

  }

};

/**
 * Assign our spawns object to module.exports.
 * @see {@link https://nodejs.org/api/modules.html#modules_the_module_object Nodejs modules: The module object}
 * @see {@link https://nodejs.org/api/modules.html#modules_module_exports Nodejs modules: module exports}
 */
module.exports = spawns;
