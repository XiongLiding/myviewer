#!/usr/bin/env node

const http = require('http');
const mysql = require('mysql');
const map = require('async/map');
const _ = require('underscore');
const viz = require('viz.js');

const connection = mysql.createConnection({
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});
connection.connect();

const getStruct = (cb) => {
    connection.query('SHOW TABLES', (err, tables, fields) => {
        if (err) return;

        const field = fields[0].name;
        const tnames = _.map(tables, (v) => v[field]);

        map(tnames, (tname, fn) => {
            connection.query(`SHOW COLUMNS FROM \`${tname}\``, (err, fields) => {
                fn(err, {
                    tname: tname,
                    fields: fields,
                });
            });
        }, cb);
    });
};

const getRelation = (cb) => {
    connection.query('SELECT `TABLE_NAME`, `COLUMN_NAME`, `REFERENCED_TABLE_NAME`, `REFERENCED_COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`KEY_COLUMN_USAGE` WHERE `TABLE_SCHEMA` = SCHEMA() AND `REFERENCED_TABLE_SCHEMA` = SCHEMA() AND `REFERENCED_TABLE_NAME` IS NOT NULL', (err, relations) => {
        cb(err, relations);
    });
};

const wrap = (outside, inside) => {
    return `<${outside}>${inside}</${outside}>`;
}

// 生成各表格对应的 subgraph，为了生成出来的代码能对齐，这里添加了一些空格
const dotTable = (table) => {
    const fields = _.map(table.fields, (v) => {
        var field = v.Field;
        if (v.Key == 'PRI') {
            field = wrap('U', field);
        }
        return `<tr><td port="${v.Field}">${field}:<i>${v.Type}</i></td></tr>`;
    }).join('\n            ');

    return `    subgraph "table_${table.tname}" {
        node [ shape = "plaintext" ]; 
        "${table.tname}" [ label=<
            <table border="0" cellspacing="0" cellborder="1">
            <tr><td bgcolor="#DDDDDD">${table.tname}</td></tr>
            ${fields}
            </table>
        >]
    }`;
};

const dotRelation = (relations) => {
    return _.map(relations, (v) => {
        return `${v.TABLE_NAME}:${v.COLUMN_NAME} -> ${v.REFERENCED_TABLE_NAME}:${v.REFERENCED_COLUMN_NAME}`
    }).join('\n    ');
};

const dotDatabase = (subgraphs, relation) => {
    return `digraph "${process.env.DATABASE}" {
    compound = true
    node [ shape = record ]
    fontname = "Helvetica"
    ranksep = 1.25
    rankdir = LR;
${subgraphs}
    ${relation}
}`
};

http.createServer((req, res) => {
    getStruct((err, tables) => {
        const subgraphs = _.map(tables, dotTable).join('\n');
        getRelation((err, relations) => {
            const relation = dotRelation(relations);
            const digraph = dotDatabase(subgraphs, relation);
            //return res.end(digraph);
            const svg = viz(digraph, {
                format: 'svg',
                engin: 'dot',
            });
            return res.end(svg);
        });
    });
}).listen(process.env.LISTEN || 6984, (err) => {
    console.log(`listen: ${process.env.LISTEN || 6984}`);
});
