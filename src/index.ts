interface HtmlTagObject {
  /**
   * Attributes of the html tag
   * E.g. `{'disabled': true, 'value': 'demo'}`
   */
  attributes: {
    [attributeName: string]: string | boolean;
  };
  /**
   * The tag name e.g. `'div'`
   */
  tagName: string;
  /**
   * The inner HTML
   */
  innerHTML?: string;
      /**
   * Whether this html must not contain innerHTML
   * @see https://www.w3.org/TR/html5/syntax.html#void-elements
   */
  voidTag: boolean;
}

interface ExternalLink {
  type: 'script' | 'css',
  src: string;
}
interface Options {
  externals: ExternalLink[];
}

class ExternalHtmlWebpackPlugin {
  externals: ExternalLink[]
  bodyTags: HtmlTagObject[]

  constructor(options: Options) {
    this.externals = options.externals;

    this.bodyTags = options.externals.filter(item => item.type === 'script')
      .map(item => ({
        tagName: 'script',
        voidTag: false,
        attributes: {
          defer:false,
          src: item.src,
        },
      }));
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('ExternalHtmlWebpackPlugin', compilation => {
      const ctrInstace = compilation.options.plugins.find(item => item.constructor.name === 'HtmlWebpackPlugin');
      const ctr = ctrInstace.constructor;
      ctr.getHooks(compilation).alterAssetTags.tapPromise('insertExternals', pluginArgs => {
        return new Promise(resolve => {
          resolve({
            ...pluginArgs,
            assetTags: {
              ...pluginArgs.assetTags,
              scripts: [
                ...this.bodyTags,
                ...pluginArgs.assetTags.scripts,
              ],
            },
          });
        });
        
      });

    });
  }
}

export default ExternalHtmlWebpackPlugin;