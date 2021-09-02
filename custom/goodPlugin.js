class goodPlugin {
    constructor(options) {
        this.options = options;
    }
    apply (compiler) {
        compiler.hooks.emit.tapAsync('goodPlugin', (compilation, callback) => {
            let str = ''
            for (let filename in compilation.assets){
              str += `文件:${filename}  大小${compilation.assets[filename]['size']()}\n`
            }
            // 通过compilation.assets可以获取打包后静态资源信息，同样也可以写入资源
            compilation.assets['fileSize.md'] = {
              source:function(){
                return str
              },
              size:function(){
                return str.length
              }
            }
            console.log('str=', str)
            callback();
        })
    }
}

module.exports = goodPlugin;