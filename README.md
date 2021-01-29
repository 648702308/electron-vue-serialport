


# 项目运行环境
### 1，必须安装nodejs
node下载地址-[Nodejs](http://nodejs.cn/download/)

### 2，安装nod-gyp
node-gyp是用来编译c++模块的工具，这里用来编译serialport，
node-gyp的github文档-[node-gyp文档](https://github.com/nodejs/node-gyp)

全局安装 `npm install -g node-gyp`

通过命令`npm install --global --production windows-build-tools`,但是要注意
的是必须以管理员的身份启动CMD窗口

安装完成之后执行一下命令
npm config set msvs_version 2017

> 其他安装方法自行百度

## 项目的安装与使用
### clone到本地

``` bash
# clone到本地
git clone https://github.com/BaiFangZi/electron-serialport.git

# 切换到项目目录
npm install`或者`cnpm install

# 使用node-gyp rebuild编译
cd ./node_modules/@serialport/bindings
node-gyp rebuild --target=6.0.10 --arch=x64 --dist-url=https://npm.taobao.org/mirrors/atom-shell
或
node-gyp rebuild --target=6.0.10 --arch=ia32 --dist-url=https://npm.taobao.org/mirrors/atom-shell

# 然后再返回根目录
cd ../../../

# 启动项目
npm run dev

# 项目打包生成exe文件
npm run build

```
