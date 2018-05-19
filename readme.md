# myviewer
MySQL Database ER Diagram Viewer.

## Preview

![SVG in browser](http://p1kp5xfj8.bkt.clouddn.com/2501526708315_.pic_hd.jpg)

## Install
```
npm i -g myviewer
```

## Usage
```
HOST=127.0.0.1 USER=root DATABASE=monitoring myviewer
```

Visit http://127.0.0.1:6984 in browser support svg. Click refresh after database changes.

### Enviroment Variable

| Variable | Mean | Default |
| ---- | ---------- | --------- |
| HOST | MySQL host | 127.0.0.1 |
| PORT | MySQL port | 3306 |
| USER | MySQL user | current user |
| PASSWORD | MySQL password | |
| DATABASE | MySQL database | |
| LISTEN | http port | 6984 |
