### 媒体查询

#### 1、媒体查询
媒体查询包含了一个媒体类型和至少一个使用如宽度、高度和颜色等媒体属性来限制样式表范围的表达式。 
```HTML
<!-- link元素中的CSS媒体查询 -->
<link rel="stylesheet" media="(max-width: 800px)" href="demo.css" />

<!-- 样式表中的CSS媒体查询 -->
<style>
@media (max-width: 600px) {
  .facet_sidebar {
    display: none;
  }
}
</style>
```

有逻辑操作符and/not/only可以构造复杂的CSS媒体查询，具体可以参照   <br>
[MDN关于CSS媒体查询的详细介绍](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)

我用到的手机端页面自适应是rem布局，在项目中引入如下javascript代码即可：
```javascript
//如果页面的宽度超过了640px，那么页面中html的font-size恒为100px，否则，页面中html的font-size的大小为： 100 * (当前页面宽度 / 640) 
    (function (doc, win) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                if(clientWidth>=640){
                    docEl.style.fontSize = '100px';
                }else{
                    docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
                }
            };

        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
    })(document, window);
```
rem就是字体的大小，这里按照1rem = 100px 来给页面中涉及到尺寸（例如height、margin、padding、width等）来等比例缩展。

不过现在阿里团队推出了高清方案的布局方式，先上代码：
```HTML
    <script>
        !function (e) {
        function t(a) {
            if (i[a])return i[a].exports;
            var n = i[a] = {exports: {}, id: a, loaded: !1};
            return e[a].call(n.exports, n, n.exports, t), n.loaded = !0, n.exports
        }
   
        var i = {};
        return t.m = e, t.c = i, t.p = "", t(0)
    }([function (e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", {value: !0});
        var i = window;
        t["default"] = i.flex = function (e, t) {
            var a = e || 100, n = t || 1, r = i.document, o = navigator.userAgent, d = o.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i), l = o.match(/U3\/((\d+|\.){5,})/i), c = l && parseInt(l[1].split(".").join(""), 10) >= 80, p = navigator.appVersion.match(/(iphone|ipad|ipod)/gi), s = i.devicePixelRatio || 1;
            p || d && d[1] > 534 || c || (s = 1);
            var u = 1 / s, m = r.querySelector('meta[name="viewport"]');
            m || (m = r.createElement("meta"), m.setAttribute("name", "viewport"), r.head.appendChild(m)), m.setAttribute("content", "width=device-width,user-scalable=no,initial-scale=" + u + ",maximum-scale=" + u + ",minimum-scale=" + u), r.documentElement.style.fontSize = a / 2 * s * n + "px"
        }, e.exports = t["default"]
    }]);
    flex(100, 1);
    </script>
```
原理是根据设备屏幕的DPR（设备像素比，若dpr=2时，表示1个CSS像素由4个物理像素点组成）动态设置 html 的font-size, 同时根据设备DPR调整页面的缩放值，进而达到高清效果。 <br>
对比上述自适应方案的优势是： <br>
* 上一个方案是设备屏幕越大元素越大，此方案是屏幕越大显示的内容越多，保证了不同设备下视觉体验的一致性
* 有效解决移动端真实1px问题

使用的话和上一个方案一样，1rem = 100px。



###### 参考资料
[移动前端开发调试](http://yujiangshui.com/multidevice-frontend-debug/) <br>
[移动Web资源整理](http://www.cnblogs.com/PeunZhang/p/3407453.html)













