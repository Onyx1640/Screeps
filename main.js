var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var spawn = "Onyx1640_SP0001";
var numHarvesters = 8;
var numUpgraders = 4;
var numBuilders = 10;

module.exports.loop = function () {
    //Cleanup Dead Creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    //builder Autospawn
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builders: ' + builders.length);

    if(builders.length < numBuilders) {
        var newName = Game.spawns[spawn].createCreep([WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
        console.log('Spawning new builder: ' + newName);
    }

    //Upgrader Autospawn
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + upgraders.length);

    if(upgraders.length < numUpgraders) {
        var newName = Game.spawns[spawn].createCreep([WORK,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
    }

    //Autospawn Harvesters
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < numHarvesters) {
        var newName = Game.spawns[spawn].createCreep([WORK,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    }

    if(Game.spawns[spawn].spawning) {
        var spawningCreep = Game.creeps[Game.spawns[spawn].spawning.name];
        Game.spawns[spawn].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns[spawn].pos.x + 1,
            Game.spawns[spawn].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            //console.log("Harvester: " + creep);
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            //console.log("Upgrader: " + creep);
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            //console.log("Builder: " + creep);
            roleBuilder.run(creep);
        }

    }
}