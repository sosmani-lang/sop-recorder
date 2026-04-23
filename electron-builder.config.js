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
    owner: "sosmani-lang",
    repo: "sop-recorder"
  },
  extraResources: [
    {
      from: "resources/",
      to: "resources/",
      filter: ["**/*"]
    }
  ],
  asarUnpack: [
    "node_modules/uiohook-napi/**/*",
    "node_modules/screenshot-desktop/**/*",
    "node_modules/active-win/**/*"
  ]
}
