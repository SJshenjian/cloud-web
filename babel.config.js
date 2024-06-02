module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins": [
    "transform-remove-strict-mode", // 去除严格约束时使用
    ["@babel/plugin-transform-private-methods",{"loose":true}],
    ["@babel/plugin-transform-class-properties", {
      "loose": true
    }],
    ["@babel/plugin-transform-private-property-in-object", {
      "loose": true
    }]
  ]
}
