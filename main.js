var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var spawn = "Spawn1";
var numHarvesters = 10;
var numUpgraders = 0;
var numBuilders = 0;
var numRepair = 0;
var roomInfo = new RoomVisual();
var numClaimers = 0;
var energySource = 0;

module.exports.loop = function () {
    roomInfo.clear();
    roomInfo.text("CPU: " + Game.cpu.getUsed(), 10, 1, {align: "left"});
    var numSource0 = _.filter(Game.creeps, (creep) => creep.memory.energySource == '0');
    var numSource1 = _.filter(Game.creeps, (creep) => creep.memory.energySource == '1');
    roomInfo.text("Creeps using Source0: " + numSource0.length, 10, 2, {align: "left"});
    roomInfo.text("Creeps using Source1: " + numSource1.length, 10, 3, {align: "left"});
    if(numSource0.length >= numSource1.length) {
        energySource = 1;
    }
    else {
        energySource = 0;
    }
    //Cleanup Dead Creeps
    Memory.towerAttachMsg = 0;
    if(Memory.towerAttachMsg > 0) {
        Memory.towerAttachMsg -1;
    }
    Memory.outOfBuilders = 0;
    if(Memory.outOfBuilders > 0) {
        Memory.outOfBuilders -1;
    }
    Memory.outOfUpgraders = 0;
    if(Memory.outOfUpgraders > 0) {
        Memory.outOfUpgraders -1;
    }
    Memory.outOfHarvesters = 0;
    if(Memory.outOfHarvesters > 0) {
        Memory.outOfHarvesters -1;
    }
    Memory.outOfRepairers = 0;
    if(Memory.outOfRepairers > 0) {
        Memory.outOfRepairers -1;
    }
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
            if(Memory.towerAttachMsg == 0) {
                Memory.towerAttachMsg = 20;
                Game.notify("Tower has attacked hostile");
            }
            tower.attack(closestHostile);
        }
    }
    
    //claimer Autospawn
    var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
    roomInfo.text('Claimers: ' + claimers.length + "(" + numClaimers + ")", 4, 5, {align: 'left'});
    // if (claimers.length == 0) {
    //     if(Memory.outOfBuilders == 0) {
    //         Memory.outOfBuilders = 30;
    //         Game.notify("Out of Builders");
    //     }
        
    // }

    if(claimers.length < numClaimers) {
        var newName = Game.spawns[spawn].createCreep([CLAIM,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'claimer'});
        //console.log('Spawning new builder: ' + newName);
    } 
    
    //builder Autospawn
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    roomInfo.text('Builders: ' + builders.length + "(" + numBuilders + ")", 4, 2, {align: 'left'});
    if (builders.length == 0) {
        if(Memory.outOfBuilders == 0) {
            Memory.outOfBuilders = 30;
            //Game.notify("Out of Builders");
        }
        
    }

    if(builders.length < numBuilders) {
        var newName = Game.spawns[spawn].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'builder'});
        //console.log('Spawning new builder: ' + newName);
    }

    //Upgrader Autospawn
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    roomInfo.text('Upgraders: ' + upgraders.length + "(" + numUpgraders + ")", 4, 3, {align: 'left'});
    if (upgraders.length == 0) {
        if(Memory.outOfUpgraders == 0) {
            Memory.outOfUpgraders = 30;
            //Game.notify("Out of Upgraders");
        }
    }

    if(upgraders.length < numUpgraders) {
        var newName = Game.spawns[spawn].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'upgrader'});
        //console.log('Spawning new upgrader: ' + newName);
    }

    //Autospawn Harvesters
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    roomInfo.text('Harvesters: ' + harvesters.length + "(" + numHarvesters + ")", 4, 4, {align: 'left'});
    if (harvesters.length == 0) {
        if(Memory.outOfHarvesters == 0) {
            Memory.outOfHarvesters = 30;
            Game.notify("Out of Harvesters");
        }
    }

    if(harvesters.length < numHarvesters) {
        var newName = Game.spawns[spawn].createCreep([WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'harvester', energySource: energySource});
        //console.log('Spawning new harvester: ' + newName);
    }
    
    //Repair Autospawn
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    roomInfo.text('Repairers: ' + repairers.length + "(" + numRepair + ")", 4, 1, {align: 'left'});
    if (repairers.length == 0) {
        if(Memory.outOfRepairers == 0) {
            Memory.outOfRepairers = 30;
            //Game.notify("Out of Repairers");
        }
    }

    if(repairers.length < numRepair) {
        var newName = Game.spawns[spawn].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'repairer'});
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
            roleHarvester.run(creep);
        }

    }
}