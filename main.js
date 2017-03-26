var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleHarvesterv2 = require('role.harvesterv2');
var spawn = "Spawn1";
var numHarvesters = 4;
var numUpgraders = 2;
var numBuilders = 4;
var numRepair = 2;
var numHarvesterv2s = 2;
var roomInfo = new RoomVisual();
var numClaimers = 0;
var energySource = 0;

module.exports.loop = function () {
    Memory.containerEnergy = 0;
    roomInfo.clear();
    roomInfo.text("CPU: " + Game.cpu.getUsed(), 10, 1, {align: 'left', opacity: .4});
    var numSource0 = _.filter(Game.creeps, (creep) => creep.memory.energySource == '0');
    var numSource1 = _.filter(Game.creeps, (creep) => creep.memory.energySource == '1');
    roomInfo.text("Creeps using Source0: " + numSource0.length, 10, 2, {align: 'left', opacity: .4});
    roomInfo.text("Creeps using Source1: " + numSource1.length, 10, 3, {align: 'left', opacity: .4});
    if(numSource0.length >= numSource1.length) {
        energySource = 1;
    }
    else {
        energySource = 0;
    }
    try {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            var numConstSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            roomInfo.text("Number of Construction Sites: " + numConstSites.length, 10, 4, {align: 'left', opacity: .4});
            if (numConstSites.length <= 1 && Memory.constSiteNotif == 0) {
                Game.notify("Down to one construction site.");
                Memory.constSiteNotif = 1;
            }
            else {
                Memory.constSiteNotif = 0;
            }
            break;
        }
    }
    catch (ex) {
        console.log(ex);
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
    roomInfo.text('Claimers: ' + claimers.length + "(" + numClaimers + ")", 4, 5, {align: 'left', opacity: .4});
    // if (claimers.length == 0) {
    //     if(Memory.outOfBuilders == 0) {
    //         Memory.outOfBuilders = 30;
    //         Game.notify("Out of Builders");
    //     }
        
    // }

    if(claimers.length < numClaimers) {
        var newName = Game.spawns[spawn].createCreep([CLAIM,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'claimer', energySource: energySource});
        //console.log('Spawning new builder: ' + newName);
    } 
    
    //builder Autospawn
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    roomInfo.text('Builders: ' + builders.length + "(" + numBuilders + ")", 4, 2, {align: 'left', opacity: .4});
    if (builders.length == 0) {
        if(Memory.outOfBuilders == 0) {
            Memory.outOfBuilders = 30;
            //Game.notify("Out of Builders");
        }
        
    }

    if(builders.length < numBuilders) {
        var newName = Game.spawns[spawn].createCreep([WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'builder', energySource: energySource});
        //console.log('Spawning new builder: ' + newName);
    }

    //Upgrader Autospawn
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    roomInfo.text('Upgraders: ' + upgraders.length + "(" + numUpgraders + ")", 4, 3, {align: 'left', opacity: .4});
    if (upgraders.length == 0) {
        if(Memory.outOfUpgraders == 0) {
            Memory.outOfUpgraders = 30;
            //Game.notify("Out of Upgraders");
        }
    }

    if(upgraders.length < numUpgraders) {
        var newName = Game.spawns[spawn].createCreep([WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'upgrader', energySource: energySource});
        //console.log('Spawning new upgrader: ' + newName);
    }
    
    //Repair Autospawn
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    roomInfo.text('Repairers: ' + repairers.length + "(" + numRepair + ")", 4, 1, {align: 'left', opacity: .4});
    if (repairers.length == 0) {
        if(Memory.outOfRepairers == 0) {
            Memory.outOfRepairers = 30;
            //Game.notify("Out of Repairers");
        }
    }

    if(repairers.length < numRepair) {
        var newName = Game.spawns[spawn].createCreep([WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'repairer', energySource: energySource});
        //console.log('Spawning new repairer: ' + newName);
    }

    //Autospawn Harvesters
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    roomInfo.text('Harvesters: ' + harvesters.length + "(" + numHarvesters + ")", 4, 4, {align: 'left', opacity: .4});
    if (harvesters.length == 0) {
        if(Memory.outOfHarvesters == 0) {
            Memory.outOfHarvesters = 30;
            Game.notify("Out of Harvesters");
        }
    }

    if(harvesters.length < numHarvesters) {
        var newName = Game.spawns[spawn].createCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'harvester', energySource: 1});
        //console.log('Spawning new harvester: ' + newName);
    }

    //HarvesterV2 Autospawn
    try {
        var unAttendedContainer = null;
        var harvestersv2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvesterv2');
        for(var i in harvestersv2) {
            var creep = harvestersv2[i];
            var a = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER
                }
            });
            for(var b in a) {
                var container = a[b];
                if(creep.memory.attendedContainer == container.id)
                    continue;
                else
                    unAttendedContainer = container.id;
            }
        }
        //console.log(unAttendedContainer);
        roomInfo.text('HarvesterV2s: ' + harvestersv2.length + "(" + numHarvesterv2s + ")", 4, 6, {align: 'left', opacity: .4});
        if(numHarvesterv2s < harvestersv2.length) {
            var newName = Game.spawns[spawn].createCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE], undefined, {role: 'harvesterv2', attendedContainer: null});   
        }
    }
    catch(ex) {
        console.log(ex);
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
            roleRepair.run(creep);
        }
        if(creep.memory.role == 'harvesterv2') {
            roleHarvesterv2.run(creep);
        }

    }
    roomInfo.text("Total Energy Stored: " + Memory.containerEnergy, 10, 5, {align: 'left', opacity: .4});
}