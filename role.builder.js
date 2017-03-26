var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleRepair = require('role.repair');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(target != null) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
            else {
                roleRepair.run(creep);
            }
            // else {
            //     var targets = creep.room.find(FIND_STRUCTURES, {
            //         filter: (structure) => {
            //             return (structure.structureType == STRUCTURE_TOWER) &&
            //                 structure.energy < structure.energyCapacity;
            //         }
            //     });
            //     if(targets.length > 0) {
            //         if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //             creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            //         }
            //     }
            //     else {
            //         if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            //             creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            //         }
            //     }
            // }
        }
        else {
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
            activeContainers.sort(function(a, b){return a - b});
            activeContainers.pop();
            if(creep.withdraw(creep.pos.findClosestByRange(activeContainers), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.pos.findClosestByRange(activeContainers), {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    }
};

module.exports = roleBuilder;