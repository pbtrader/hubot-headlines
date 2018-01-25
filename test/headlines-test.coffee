
Helper = require('hubot-test-helper')
chai = require 'chai'

expect = chai.expect

helper = new Helper('../src/headlines.js')

describe 'headlines', ->
  beforeEach ->
    @room = helper.createRoom()

  afterEach ->
    @room.destroy()

  it 'responds to ping', ->
    @room.user.say('ping', '@hubot PONG').then =>
      expect(@room.messages).to.eql [
        ['ping', '@hubot PONG']
      ]