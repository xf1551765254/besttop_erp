/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-03-04 10:03:51
 */
module.exports = {
    presets: [
        '@vue/app'
    ],
    plugins: process.env.NODE_ENV === 'production'
        ? [
            [
                'component',
                {
                    'libraryName': 'element-ui',
                    'styleLibraryName': 'theme-chalk'
                }
            ]
        ]
        : undefined
    // plugins: [
    //   [ 'import', {
    //     'libraryName': 'ant-design-vue',
    //     'libraryDirectory': 'es',
    //     'style': true // `style: true` 会加载 less 文件
    //   } ]
    // ]

}
