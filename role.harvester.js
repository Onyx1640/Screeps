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
                creep.moveTo(creep.pos.findClosestByPath(activeContainers), {visualizePathStyle: {stroke: '#00ff00'}});
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
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#00ff00'}});
                }
            }
            else {
                if(creep.carry.energy < creep.carry.carryCapacity)
                    creep.memory.needRefill = 1;
                else
                    creep.moveTo(Game.flags.Flag1);
            }
        }
    }
};

module.exports = roleHarvester;