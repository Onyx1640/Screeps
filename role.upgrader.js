var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#0066ff'}});
            }
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
            if(creep.withdraw(creep.pos.findClosestByPath(activeContainers), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.pos.findClosestByPath(activeContainers), {visualizePathStyle: {stroke: '#0066ff'}});
            }
        }
    }
};

module.exports = roleUpgrader;