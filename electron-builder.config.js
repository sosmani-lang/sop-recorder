/**
 * @type {import('electron-builder').Configuration}
 */
module.exports = {
  appId: "com.yourcompany.sop-recorder",
  productName: "SOP Recorder",
  directories: {
    output: "release"
  },
  files: [
    "dist/**/*",
    "node_modules/**/*",
    "package.json"
  ],
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64"]
      }
    ],
    icon: "resources/icon.ico"
  },
  nsis: {
    oneClick: true,
    perMachine: false,
    allowToChangeInstallationDirectory: false,
    deleteAppDataOnUninstall: false
  },
  publish: {
    provider: "github",
    owner: "YOUR_GITHUB_USERNAME",
    repo: "sop-recorder"
  },
  extraResources: [
    {
      from: "resources/",
      to: "resources/",
      filter: ["**/*"]
    }
  ]
}
