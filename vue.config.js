/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: haile
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-05-28 16:50:00
 */
const path = require('path')
const webpack = require('webpack')
const {
    BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer')
    // gzip压缩插件
const CompressionWebpackPlugin = require('compression-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {

    productionSourceMap: false,

    configureWebpack: config => {
        config.plugins = [
            ...config.plugins,
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.ProvidePlugin({
                'window.Quill': 'quill',
                'Quill': 'quill'
            })
        ]
        const prodPlugins = [
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
                threshold: 10240,
                minRatio: 0.8
            })
        ]
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.plugins = [...config.plugins, ...prodPlugins]
                // config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
                // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
                // config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
                // config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
            config.optimization.splitChunks = {
                ...config.optimization.splitChunks,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        minSize: 30000,
                        minChunks: 1,
                        chunks: 'initial',
                        priority: 1
                    },
                    commons: {
                        test: /[\\/]src[\\/]common[\\/]/,
                        name: 'commons',
                        minSize: 30000,
                        minChunks: 3,
                        chunks: 'initial',
                        priority: -1,
                        reuseExistingChunk: true
                    }
                }
            }
        } else {
            // 为开发环境修改配置...
        }
    },

    chainWebpack: (config) => {
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('@api', resolve('src/api'))
            .set('@assets', resolve('src/assets'))
            .set('@comp', resolve('src/components'))
            .set('@views', resolve('src/views'))
            .set('@pages', resolve('src/pages'))
            .set('@layout', resolve('src/layout'))
            .set('@static', resolve('src/static'))
            .set('@utils', resolve('src/utils'))
            .set('@config', resolve('src/config'))
        if (process.env.NODE_ENV === 'production') {
            config
                .plugin('analyzer')
                .use(BundleAnalyzerPlugin)
                .end()
        }
        const svgRule = config.module.rule('svg')
        svgRule.uses.clear()
        svgRule.oneOf('inline')
            .resourceQuery(/inline/)
            .use('vue-svg-loader')
            .loader('vue-svg-loader')
            .end()
            .end()
            .oneOf('external')
            .use('file-loader')
            .loader('file-loader')
            .options({
                name: 'assets/[name].[hash:8].[ext]'
            })
    },

    css: {
        sourceMap: false,
        loaderOptions: {
            less: {
                modifyVars: {
                    /* less 变量覆盖，用于自定义 ant design 主题 */

                    /*
                    'primary-color': '#F5222D',
                    'link-color': '#F5222D',
                    'border-radius-base': '4px',
                    */
                },
                javascriptEnabled: true
            }
        }
    },

    lintOnSave: undefined
}