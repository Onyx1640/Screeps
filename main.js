var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var spawn = "Onyx1640_SP0001";
var numHarvesters = 6;
var numUpgraders = 5;
var numBuilders = 4;
var numRepair = 4;
var roomInfo = new RoomVisual();

module.exports.loop = function () {
    roomInfo.clear();
    roomInfo.text("CPU: " + Game.cpu.getUsed(), 10, 1, {align: "left"});
    //console.log("Number Upgrading: " + Memory.numUpgrading);
    //console.log("Number Repairing: " + Memory.numRepairing);
    //console.log("Number Harvesting: " + Memory.numHarvesting);
    //console.log("Number Building: " + Memory.numBuilding);
    //Cleanup Dead Creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            //console.log('Clearing non-existing creep memory:', name);
        }
    }
    //Tower Commands
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        // var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        //     filter: (structure) => structure.hits < structure.hitsMax
        // });
        // if(closestDamagedStructure) {
        //     tower.repair(closestDamagedStructure);
        // }
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
     
    
    //builder Autospawn
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    roomInfo.text('Builders: ' + builders.length + "(" + numBuilders + ")", 4, 2, {align: 'left'});
    if (builders.length == 0) {
        Game.notify("Out of Builders");
    }

    if(builders.length < numBuilders) {
        var newName = Game.spawns[spawn].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'builder'});
        //console.log('Spawning new builder: ' + newName);
    }

    //Upgrader Autospawn
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    roomInfo.text('Upgraders: ' + upgraders.length + "(" + numUpgraders + ")", 4, 3, {align: 'left'});
    if (upgraders.length == 0) {
        Game.notify("Out of Upgraders");
    }

    if(upgraders.length < numUpgraders) {
        var newName = Game.spawns[spawn].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'upgrader'});
        //console.log('Spawning new upgrader: ' + newName);
    }

    //Autospawn Harvesters
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    roomInfo.text('Harvesters: ' + harvesters.length + "(" + numHarvesters + ")", 4, 4, {align: 'left'});
    if (harvesters.length == 0) {
        Game.notify("Out of Harvesters");
    }

    if(harvesters.length < numHarvesters) {
        var newName = Game.spawns[spawn].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'harvester'});
        //console.log('Spawning new harvester: ' + newName);
    }
    
    //Repair Autospawn
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    roomInfo.text('Repairers: ' + repairers.length + "(" + numRepair + ")", 4, 1, {align: 'left'});
    if (repairers.length == 0) {
        Game.notify("Out of Repairers");
    }

    if(repairers.length < numRepair) {
        var newName = Game.spawns[spawn].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'repairer'});
        //console.log('Spawning new repairer: ' + newName);
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
        if(creep.memory.role == 'repairer') {
            roleBuilder.run(creep);
        }

    }
}