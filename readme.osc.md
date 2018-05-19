# myviewer
MySQL 数据库结构可视化工具，在浏览器中查看 ER 图。

## 效果

![在浏览器中查看效果](http://p1kp5xfj8.bkt.clouddn.com/2501526708315_.pic_hd.jpg)

## 安装
```
npm i -g myviewer
```

## 使用
```
HOST=127.0.0.1 USER=root DATABASE=monitoring myviewer
```

使用支持SVG的浏览器访问 http://127.0.0.1:6984 。 数据库结构变更时，刷新浏览器即可看到最新效果。

### 环境变量
参数通过环境变量传递

| 变量 | 意义 | 默认值 |
| ---- | ---------- | --------- |
| HOST | MySQL host | 127.0.0.1 |
| PORT | MySQL port | 3306 |
| USER | MySQL user | 当前用户 |
| PASSWORD | MySQL password | 无 |
| DATABASE | MySQL database | 无 |
| LISTEN | http port | 6984 |
