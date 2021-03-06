let sinon = require('sinon')
let walkSync = require('walk-sync')
let fs = require('fs')
import { test } from 'ava'
import ADR from 'adr'

let Utils = ADR.Utils

let adrTemplate = `# 1. 编写完整的单元测试

日期: 2017/11/22

## 状态

2017-11-22 提议
2017-11-26 已完成

`

let adrOptions = JSON.stringify({
  path: './',
  language: 'en'
})

test('ADR: export csv', t => {
  let ADRGetSavePathSpy = sinon.stub(Utils, 'getSavePath').returns('./')
  let consoleSpy = sinon.stub(console, 'log')
  let fsWriteSpy = sinon.stub(fs, 'writeFileSync')
  let fsReadSpy = sinon.stub(fs, 'readFileSync')
    .onCall(0).returns(JSON.stringify(adrOptions))
    .onCall(1).returns(JSON.stringify(adrOptions))
    .onCall(2).returns(JSON.stringify(adrOptions))
    .onCall(3).returns(adrTemplate)
  let entriesSpy = sinon.stub(walkSync, 'entries').returns([
    {
      relativePath: '001-编写完整的单元测试.md',
      basePath: '/Users/fdhuang/learing/adr/doc/adr/',
      mode: 33188,
      size: 246,
      mtime: 1511435254653
    }
  ])

  let results = ADR.output('csv')
  t.deepEqual(results,
`Index, Decision, Last Modified Date, Last Status
1, 编写完整的单元测试, 2017-11-23, undefined
`)
  // t.deepEqual(fsWriteSpy.calledWith('./export.csv'), true)
  ADRGetSavePathSpy.restore()
  fsReadSpy.restore()
  fsWriteSpy.restore()
  entriesSpy.restore()
  consoleSpy.restore()
})

test('ADR: export json', t => {
  let ADRGetSavePathSpy = sinon.stub(Utils, 'getSavePath').returns('./')
  let consoleSpy = sinon.stub(console, 'log')
  let fsWriteSpy = sinon.stub(fs, 'writeFileSync')
  let fsReadSpy = sinon.stub(fs, 'readFileSync')
    .onCall(0).returns(JSON.stringify(adrOptions))
    .onCall(1).returns(JSON.stringify(adrOptions))
    .onCall(2).returns(JSON.stringify(adrOptions))
    .onCall(3).returns(adrTemplate)
  let entriesSpy = sinon.stub(walkSync, 'entries').returns([
    {
      relativePath: '001-编写完整的单元测试.md',
      basePath: '/Users/fdhuang/learing/adr/doc/adr/',
      mode: 33188,
      size: 246,
      mtime: 1511435254653
    }
  ])

  let results = ADR.output('json')
  t.deepEqual(results, `[{"index":1,"decision":"编写完整的单元测试","modifiedDate":"2017-11-23"}]`)
  // t.deepEqual(fsWriteSpy.calledWith('./export.csv'), true)
  ADRGetSavePathSpy.restore()
  fsReadSpy.restore()
  fsWriteSpy.restore()
  entriesSpy.restore()
  consoleSpy.restore()
})

test('ADR: when export error', t => {
  let consoleSpy = sinon.stub(console, 'log')

  ADR.output('excel')
  t.deepEqual(consoleSpy.calledWith('\n error: type excel current not supported'), true)
  consoleSpy.restore()
})

test('ADR: export markdown', t => {
  let ADRGetSavePathSpy = sinon.stub(Utils, 'getSavePath').returns('./')
  let consoleSpy = sinon.stub(console, 'log')
  let fsAppendSpy = sinon.stub(fs, 'appendFileSync')
  let fsReadSpy = sinon.stub(fs, 'readFileSync')
    .onCall(0).returns(adrTemplate)
    .onCall(1).returns(`# 0. no index case`)
  let entriesSpy = sinon.stub(walkSync, 'entries').returns([
    {
      relativePath: '001-编写完整的单元测试.md',
      basePath: '/Users/fdhuang/learing/adr/doc/adr/',
      mode: 33188,
      size: 246,
      mtime: 1511435254653
    },
    {
      relativePath: 'README.md',
      basePath: '/Users/fdhuang/learing/adr/doc/adr/',
      mode: 33188,
      size: 246,
      mtime: 1511435254653
    },
    {
      relativePath: '0000-Hello-world.md',
      basePath: '/Users/fdhuang/learing/adr/doc/adr/',
      mode: 33188,
      size: 246,
      mtime: 1511435254653
    }
  ])

  ADR.output('markdown')
  t.deepEqual(fsAppendSpy.calledWith('output.md'), true)
  ADRGetSavePathSpy.restore()
  fsReadSpy.restore()
  // fsAppendSpy.restore()
  entriesSpy.restore()
  consoleSpy.restore()
})
