# 目的
基于`html-webpack-plugin`，不需要额外定义`html-webpack-plugin`模板的，cdn插入插件。

开发过程中，发现如果webpack进入了不同版本的`html-webpack-plugin`插件时，这个插件的cdn插入不生效。比如：

```
- node_modules
  - react-scripts
    - node_modules
      - html-webpack-plugin
  - mn-cdn-html-webpack-plugin
    - node_modules
      - html-webpack-plugin
```

`react-scripts`和`mn-cdn-html-webpack-plugin`引用的不是一个插件，最后会导致本插hook，tap上去了，但是整个`complication`触发不生效。所以，本插件也不依赖`html-webpack-plugin`。

# 用法

```
module.exports = {
  ...
  plugins: [
    new MnCdnHtmlWebpackPlugin({
      externals: [
        {
          type: 'script',
          src: 'https://whale-alivia.oss-cn-hangzhou.aliyuncs.com/lib/aliyun-oss-sdk.6.10.0.min.js',
        },
      ],
    })
  ]
};
```

`type`为`script`的时候，注入到`body`中。`type`为`css`的时候，注入到`header`中。