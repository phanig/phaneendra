/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Module = typeof Module !== "undefined" ? Module : {};

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
}

Module.expectedDataFileDownloads++;
(function () {
  // When running as a pthread, FS operations are proxied to the main thread, so we don't need to
  // fetch the .data bundle on the worker
  if (Module["ENVIRONMENT_IS_PTHREAD"]) return;
  var loadPackage = function (metadata) {
    var PACKAGE_PATH = "";
    if (typeof window === "object") {
      PACKAGE_PATH = window["encodeURIComponent"](
        window.location.pathname
          .toString()
          .substring(0, window.location.pathname.toString().lastIndexOf("/")) +
          "/"
      );
    } else if (
      typeof process === "undefined" &&
      typeof location !== "undefined"
    ) {
      // web worker
      PACKAGE_PATH = encodeURIComponent(
        location.pathname
          .toString()
          .substring(0, location.pathname.toString().lastIndexOf("/")) + "/"
      );
    }
    var PACKAGE_NAME =
      "blaze-out/k8-opt/genfiles/experimental/lamda_demo_3/demo/talking_heads_microphone_assets.data";
    var REMOTE_PACKAGE_BASE =
      "talking_head_v1/talking_heads_microphone_assets.data";
    if (
      typeof Module["locateFilePackage"] === "function" &&
      !Module["locateFile"]
    ) {
      Module["locateFile"] = Module["locateFilePackage"];
      err(
        "warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)"
      );
    }
    var REMOTE_PACKAGE_NAME = Module["locateFile"]
      ? Module["locateFile"](REMOTE_PACKAGE_BASE, "")
      : REMOTE_PACKAGE_BASE;
    var REMOTE_PACKAGE_SIZE = metadata["remote_package_size"];

    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      if (
        typeof process === "object" &&
        typeof process.versions === "object" &&
        typeof process.versions.node === "string"
      ) {
        require("fs").readFile(packageName, function (err, contents) {
          if (err) {
            errback(err);
          } else {
            callback(contents.buffer);
          }
        });
        return;
      }
      var xhr = new XMLHttpRequest();
      xhr.open("GET", packageName, true);
      xhr.responseType = "arraybuffer";
      xhr.onprogress = function (event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size,
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil((total * Module.expectedDataFileDownloads) / num);
          if (Module["setStatus"])
            Module["setStatus"](
              "Downloading data... (" + loaded + "/" + total + ")"
            );
        } else if (!Module.dataFileDownloads) {
          if (Module["setStatus"]) Module["setStatus"]("Downloading data...");
        }
      };
      xhr.onerror = function (event) {
        throw new Error("NetworkError for: " + packageName);
      };
      xhr.onload = function (event) {
        if (
          xhr.status == 200 ||
          xhr.status == 304 ||
          xhr.status == 206 ||
          (xhr.status == 0 && xhr.response)
        ) {
          // file URLs can return 0
          var packageData = xhr.response;
          callback(packageData);
        } else {
          throw new Error(xhr.statusText + " : " + xhr.responseURL);
        }
      };
      xhr.send(null);
    }

    function handleError(error) {
      console.error("package error:", error);
    }

    var fetchedCallback = null;
    var fetched = Module["getPreloadedPackage"]
      ? Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE)
      : null;

    if (!fetched)
      fetchRemotePackage(
        REMOTE_PACKAGE_NAME,
        REMOTE_PACKAGE_SIZE,
        function (data) {
          if (fetchedCallback) {
            fetchedCallback(data);
            fetchedCallback = null;
          } else {
            fetched = data;
          }
        },
        handleError
      );

    function runWithFS() {
      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }

      /** @constructor */
      function DataRequest(start, end, audio) {
        this.start = start;
        this.end = end;
        this.audio = audio;
      }
      DataRequest.prototype = {
        requests: {},
        open: function (mode, name) {
          this.name = name;
          this.requests[name] = this;
          Module["addRunDependency"]("fp " + this.name);
        },
        send: function () {},
        onload: function () {
          var byteArray = this.byteArray.subarray(this.start, this.end);
          this.finish(byteArray);
        },
        finish: function (byteArray) {
          var that = this;

          Module["FS_createPreloadedFile"](
            this.name,
            null,
            byteArray,
            true,
            true,
            function () {
              Module["removeRunDependency"]("fp " + that.name);
            },
            function () {
              if (that.audio) {
                Module["removeRunDependency"]("fp " + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
              } else {
                err("Preloading file " + that.name + " failed");
              }
            },
            false,
            true
          ); // canOwn this data in the filesystem, it is a slide into the heap that will never change

          this.requests[this.name] = null;
        },
      };

      var files = metadata["files"];
      for (var i = 0; i < files.length; ++i) {
        new DataRequest(
          files[i]["start"],
          files[i]["end"],
          files[i]["audio"] || 0
        ).open("GET", files[i]["filename"]);
      }

      function processPackageData(arrayBuffer) {
        assert(arrayBuffer, "Loading data file failed.");
        assert(
          arrayBuffer.constructor.name === ArrayBuffer.name,
          "bad input to processPackageData"
        );
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        // Reuse the bytearray from the XHR as the source for file reads.
        DataRequest.prototype.byteArray = byteArray;
        var files = metadata["files"];
        for (var i = 0; i < files.length; ++i) {
          DataRequest.prototype.requests[files[i].filename].onload();
        }
        Module["removeRunDependency"](
          "datafile_blaze-out/k8-opt/genfiles/experimental/lamda_demo_3/demo/talking_heads_microphone_assets.data"
        );
      }
      Module["addRunDependency"](
        "datafile_blaze-out/k8-opt/genfiles/experimental/lamda_demo_3/demo/talking_heads_microphone_assets.data"
      );

      if (!Module.preloadResults) Module.preloadResults = {};

      Module.preloadResults[PACKAGE_NAME] = { fromCache: false };
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    }
    if (Module["calledRun"]) {
      runWithFS();
    } else {
      if (!Module["preRun"]) Module["preRun"] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }
  };
  loadPackage({
    files: [
      { filename: "/christian_puppet.tflite", start: 0, end: 4069020 },
      {
        filename: "/head_motion_and_eye_blinks.csv",
        start: 4069020,
        end: 4462789,
      },
    ],
    remote_package_size: 4462789,
  });
})();
