module.exports = {
    publicPath: '/',
    pages: {
        v3: {
          // page 的入口
          entry: 'src/v3/main.js',
          // 模板来源
          template: 'public/index.html',
          // 在 dist/index.html 的输出
          filename: 'v3.html',
          // 当使用 title 选项时，
          // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
          title: '[v3]Vue tree folder',
          // 在这个页面中包含的块，默认情况下会包含
          // 提取出来的通用 chunk 和 vendor chunk。
        //   chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        // 当使用只有入口的字符串格式时，
        // 模板会被推导为 `public/subpage.html`
        // 并且如果找不到的话，就回退到 `public/index.html`。
        // 输出文件名会被推导为 `subpage.html`。
        v2: {
            entry:  'src/v2/main.js',
            filename: 'v2.html',
            title: '[v2]Vue tree folder'
        }
      }
}