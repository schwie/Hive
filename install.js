#!/usr/bin/env node

var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
var cmd = ''
var Settings = require('./Settings')
var sensorDefinitions = require('./util/SensorDefinitions.json')

var server = Settings.CouchDB.URL

cmd += 'curl -XPUT ' + server + '/config; \n'
cmd += 'curl -XPUT ' + server + '/incubator; \n'
cmd += 'curl -XPUT ' + server + '/apps; \n'
cmd += 'couchapp push ./CouchViews/config.js ' + server + '/config; \n'
cmd += 'couchapp push ./CouchViews/incubator.js ' + server + '/incubator; \n'
cmd += 'couchapp push ./Beekeeper/couchapp.js ' + server + '/apps; \n'
cmd += 'npm install forever -g; \n'

sensorDefinitions.rows.forEach(function(sensorDefinition) {
  var sensorDef = sensorDefinition.doc
  cmd += 'curl -XPUT ' + server + '/config/' + sensorDef._id + ' -d \'' + JSON.stringify(sensorDef) + '\'; \n'
})

cmd += 'curl -XPUT ' + server + '/config/HoneyJarsSettings' + ' -d \'{"lastHarvest": 0, "status": "on"}\'; \n'
cmd += 'curl -XPUT ' + server + '/config/Settings' + ' -d \'{"gmailUserName": "", "gmailPassword":"", "gmailEmailAddress":"", "sendAlertsTo":""}\'; \n'
cmd += 'curl -XPUT ' + server + '/config/drives' + ' -d \'{}\'; \n'

console.log(cmd)
exec(cmd, puts)
