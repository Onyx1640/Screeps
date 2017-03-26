Memory.desiredWallLevel = 5000;
Memory.desiredRoadLevel = 5000;
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
//var roleBuilder = require('role.builder');
var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('🚧 repair');
        }
        if(!creep.memory.repairing) {
            var activeContainers = [];
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER && structure.energy != 0
                }
            });
            for(var i in containers) {
                var cont = containers[i];
                if (cont.store[RESOURCE_ENERGY] != 0) {
                    activeContainers.push(cont);
                }
            }
            if(creep.withdraw(creep.pos.findClosestByPath(activeContainers), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.pos.findClosestByPath(activeContainers), {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            //Repair Walls First
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_WALL) &&
                        structure.hits < Memory.desiredWallLevel
                }
            });
            //console.log(Memory.desiredWallLevel);
            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                //Now Repair Roads
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_ROAD) &&
                            structure.hits < Memory.desiredRoadLevel
                    }
                });
                if(targets.length > 0) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else {
                    //Now Repair Storage Units
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_STORAGE) &&
                                structure.hits < structure.hitsMax
                        }
                    });
                    if(targets.length > 0) {
                        if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                    else {
                        //Now Revert to Upgrading Room Controller if Everything is Repaired
                        roleUpgrader.run(creep);
                    }
                }
            }
        }
    }
};

module.exports = roleRepair;