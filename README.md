# 微信小程序开发框架wexp文档

## 快速入门指南

### 使用 npm 创建 wexp 项目

**全局安装或更新 wexp 命令行工具**

```bash
$ npm install wexp-cli -g
```

**更新wexp-cli**

```bash
$ wexp upgrade
```

**在工作目录下创建示例项目**

普通wexp项目
```bash
$ wexp init wexp-demo myproject
```

集成wexp-redux项目(`wexp-cli^1.0.6`)
```bash
$ wexp init wexp-redux-demo myproject
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

**开发者工具预览**

微信开发者工具-> 选择项目目录下的dist目录

**npm组件使用方法**

原生组件库（wexp版本组件）无需添加额外的引入操作，按照原生引用组件的方式一样，wexp组件写法请参照([wexp组件创建教程](https://github.com/Chaunjie/wexp-button))

```bash
usingComponents: {
  "k-test": "npm_module/path/index"
}
```

### wexp项目的目录结构

```
├── dist                   开发者工具运行目录
|   ├── components         打包后的组件目录  
|   ├── npm                模块打包后的目录
|   ├── pages              打包后的页面目录
|   └── app.*              打包后的入口相关文件
├── node_modules           小程序npm包（支持原生小程序组件库npm包以及wexp版本的组件）      
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
<style>
  page{
    background-color: #fff;
  }
</style>
<style lang="less" src="./less/index.less"></style>
<script>
  import wexp from 'wexp'
  
  export default class extends wexp.app {
    config = {
      'pages': [
        'pages/index/index',
        'pages/test/index'
      ],
      'window': {
        'navigationBarBackgroundColor': '#fff',
        'navigationBarTitleText': 'wexp-demo',
        'navigationBarTextStyle': 'black',
        'backgroundTextStyle': 'dark',
        'backgroundColor': '#f5f5f5'
      }
    }

    globalData = {
      name: 'xxx'
    }

    test (data) {
      console.log(data)
    }

    onLaunch (e) {}
  }
</script>
```

#### 页面(index.xu)
```javascript
<style lang="less" src="../../less/index.less"></style>
<template>
  <view class="index-page">
    <view class="icon-img">
      <view class="bg"></view>
    </view>

    <k-panel custom-class="custom-panel">
      <view class="custom-panel__title">全局变量: {{globalName}}</view>
    </k-panel>

    <k-panel custom-class="custom-panel">
      <view class="custom-panel__title">姓名: {{name}}</view>
      <k-button 
        custom-class="custom-btn" 
        name="success"
        size="small" 
        bindtap="changeName">
        点击修改name属性
      </k-button>
    </k-panel>

    <k-panel custom-class="custom-panel">
      <view class="custom-panel__title">页面: {{getPage}}</view>
      <k-button 
        custom-class="custom-btn" 
        name="success"
        size="small" 
        bindtap="changePage">
        点击修改page属性
      </k-button>
    </k-panel>

    <k-button 
      custom-class="trans-btn" 
      name="success" 
      size="large"
      bindtap="onClick">
      点击切换页面
    </k-button>

    <block wx:if="{{ logArr.length }}">
      <view 
        wx:for="{{logArr}}"
        wx:key="log-key"
        class="log-item">
        {{ item }}
      </view>
    </block>
    <view class="log-item" wx:else>暂无修改记录</view>
  </view>
</template>
<script>
  import wexp from 'wexp'

  export default class Index extends wexp.page {
    config = {
      navigationBarTitleText: '主页',
      backgroundColor: '#ccc',
      'usingComponents': {
        'k-panel': '../../components/panel/index',
        'k-button': 'wexp-button/index'
      }
    }

    data = {
      page: 1,
      name: 'chaunjie',
      globalName: '',
      logArr: []
    }

    methods = {
      changePage (e) {
        const { page } = this.data
        this.setData({
          page: page + 1
        })
      },
      changeName () {
        const { name } = this.data
        this.setData({
          name: name === 'chaunjie' ? 'xudao' : 'chaunjie'
        })
      },
      onClick (e) {
        this.$route('navigate', '../test/index', {id: 1023465})
      }
    }

    computed = {
      getPage () {
        return this.data.page
      }
    }

    watch = {
      page (newValue) {
        const { logArr } = this.data
        logArr.push('page属性修改，新值为' + newValue)
        this.setData({logArr})
      },
      name (newValue) {
        const { logArr } = this.data
        logArr.push('name属性修改，新值为' + newValue)
        this.setData({logArr})
      }
    }

    onHide () {
      console.log('on hide')
    }

    onLoad () {
      console.log('on load')
    }

    onReady () {
      console.log('on ready')
    }

    onShow () {
      console.log('on show')
      this.setData({
        globalName: this.$parent.globalData.name
      })
    }
  }
</script>
```

### 组件(test.xu)
```javascript
<style lang="less" src="../../less/test.less"></style>
<template>
  <view class="test-page">
    <k-button 
      custom-class="custom-btn" 
      name="warn"
      bindtap="changeName">
      点击修改全局name属性
    </k-button>
    <k-button 
      custom-class="custom-btn" 
      name="danger"
      bindtap="back">
      点击返回
    </k-button>
  </view>
</template>
<script>
  import wexp from 'wexp'
  export default class Test extends wexp.page {
    config = {
      'navigationBarTitleText': '测试页面',
      'usingComponents': {
        'k-panel': '../../components/panel/index',
        'k-button': 'wexp-button/index'
      }
    }

    data = {}

    methods = {
      changeName (e) {
        this.$parent.globalData.name = this.$parent.globalData.name === 'chaunjie' ? 'xudao' : 'chaunjie'
      },
      back (e) {
        this.$back()
      }
    }

    onLoad (options) {
      console.log(options)
    }
  }
</script>
```