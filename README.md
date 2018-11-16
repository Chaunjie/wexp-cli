# 微信小程序开发框架wexp文档

## 快速入门指南

### 使用 npm 创建 wexp 项目

**全局安装或更新 wexp 命令行工具**

```bash
$ npm install wexp-cli -g
```

**在工作目录下创建示例项目**

```bash
$ wexp init wexp-demo myproject
```

**进入项目**

```bash
$ cd myproject
$ npm install
```

**开启实时编译**

```bash
$ npm run dev
```

**npm组件使用方法**

原生组件库（wexp版本组件）无需添加额外的引入操作，按照原生引用组件的方式一样，wexp组件写法请参照([wexp组件创建教程](https://github.com/Chaunjie/wexp-button))

```bash
usingComponents: {
  "k-test": "npm_module/path/index"
}
```

**构建 npm**

微信开发者工具->菜单栏【工具】->构建npm

### wexp项目的目录结构

```
├── dist                   开发者工具运行目录 
|
├── node_modules           小程序npm包（支持原生小程序组件库npm包以及wexp版本的组件）
|       
├── src                    代码编写的目录（该目录为使用wexp后的开发目录）
|   ├── components         wexp组件目录（组件不属于完整页面，仅供完整页面或其他组件引用）
|   |   ├── a.xu           可复用的wexp组件a
|   |   └── b.xu           可复用的wexp组件b
|   ├── pages              wexp页面目录（属于完整页面）
|   |   ├── index.xu       index页面（经build后，会在dist目录下的pages目录生成index.js、index.json、index.wxml和index.wxss文件）
|   |   └── other.xu       other页面（经build后，会在dist目录下的pages目录生成other.js、other.json、other.wxml和other.wxss文件）
|   └── app.xu             小程序配置项（全局数据、样式、声明钩子等；经build后，会在dist目录下生成app.js、app.json和app.wxss文件）

```

## 用法
### 说明(用法)
#### 入口文件(app.xu)
```javascript
<style lang="less" src="./less/index.less"></style>
<script>
  import wexp from 'wexp'
  import regeneratorRuntime from './compile/runtime'

  export default class extends wexp.app{
    config = {
      "pages": [
        "pages/index/index"
      ],
      "window": {
        "navigationBarBackgroundColor": "#fff",
        "navigationBarTitleText": "kai-ui",
        "navigationBarTextStyle": "black",
        "backgroundTextStyle": "dark",
        "backgroundColor": "#f5f5f5"
      },
      "debug": true
    }

    globalData = {
      name: 'chaunjie'
    }
    
    test (data) {
      console.log(data)
    }

    constructor () {
      super()
    }

    sleep (s) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('promise resolved')
        }, s * 1000)
      })
    }

    async testAsync () {
      const data = await this.sleep(3)
      console.log(data)
    }


    onLaunch (e) {
      console.log(e)
      this.testAsync()
    }
  }
</script>
```

#### 页面(index.xu)
```javascript
<style>
  .container{
    background-color: orange;
  }
  .test {
    color: orange;
  }
</style>
<style lang="less" src="../../less/index.less"></style>
<template>
  <view bindtap="tapPro" class="padding">点击更新组件信息组件</view>
  <k-test text="{{name}}" bind:select="select" custom-class="test"></k-test>
  <view bindtap="doAwait">点击测试await方法</view>
  <view>{{syncItem}}</view>
</template>
<script>
  import wexp from 'wexp'
  import regeneratorRuntime from '../../compile/runtime'

  export default class Index extends wexp.page{
    config = {
      "navigationBarTitleText": "首页",
      "usingComponents": {
        "k-test": "../../components/test/index"
      }
    }

    data = {
      name: 'chaunjie',
      syncItem: '这个是异步初始化数据'
    }

    methods = {
      select (e) {
        console.log('组件传回的值:' + e.detail)
      }
    }

    onLoad () {
      this.setData({
        name: '组件初始化数据'
      })
      setTimeout(() => {
        this.$parent.globalData.name = '这是全局数据'
        console.log(this.data)
      }, 3000)
    }

    sleep (s) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('异步数据拿到')
        }, s * 1000)
      })
    }

    async testAsync () {
      const data = await this.sleep(3)
      this.setData({syncItem: data})
    }

    doAwait () {
      this.testAsync()
    }

    tapPro (e) {
      this.setData({name: '组件更新信息后显示'})
      this.$route('navigate', '../test/index')
    }
  }
</script>
```

### 组件(index.xu)
```javascript
<template>
  <view class="custom-class" bindtap="tap" data-index="{{tag}}">{{text}}</view>
</template>
<script>
  import wexp from 'wexp'
  export default class Test extends wexp.component{
    config = {
      "component": true
    }

    externalClasses = ['custom-class']

    options = {
      multipleSlots: true
    }

    properties = {
      text: {
        type: String,
        value: '99999'
      }
    }

    data = {
      tag: 'abc'
    }

    methods = {
      test () {
        console.log(99999)
      },
      tap (e) {
        console.log(e)
        const dataset = e.currentTarget.dataset
        this.doSelect.call(this, dataset.index);
      },
      doSelect (res) {
        this.triggerEvent('select', res);
      }
    }

    ready () {
      this.setData({tag: 'tapd'})
      console.log('component')
    }
  }
</script>
```