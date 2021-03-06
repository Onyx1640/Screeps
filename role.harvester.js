var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0){
            creep.memory.needRefill = 1;
        }
        if(creep.carry.energy == creep.carryCapacity) {
            creep.memory.needRefill = 0;
        }
        if(creep.memory.needRefill == 1) {
            var sources = creep.room.find(FIND_SOURCES);
            //Memory.numHarvesting = Memory.numHarvesting - 1;
            if(creep.harvest(sources[creep.memory.energySource]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.energySource], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            //Memory.numHarvesting = Memory.numHarvesting + 1;
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;