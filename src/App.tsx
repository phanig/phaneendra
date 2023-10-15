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

import React from "react";
import "./App.css";

import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { datadogRum } from "@datadog/browser-rum";

datadogRum.init({
  applicationId: "2b7e8214-35c4-4691-ab02-4356d8099ba4",
  clientToken: "pubd2a89f8d39cdd89366a83bd36952b270",
  site: "us5.datadoghq.com",
  service: "avatarx",
  env: "prod",
  // Specify a version number to identify the deployed version of your application in Datadog
  // version: '1.0.0',
  sessionSampleRate: 100,
  premiumSampleRate: 100,
  trackUserInteractions: true,
  defaultPrivacyLevel: "mask-user-input",
});

datadogRum.startSessionReplayRecording();

/**  App  */
export function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId="118420081966-s1n42272jcg4r5l4erufahti23ubp8o0.apps.googleusercontent.com">
        <Router />
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}
