var roleHarvesterv2 = {
    /** @param {Creep} creep **/
    run: function(creep) {
        console.log(creep);
        if (creep.memory.attendedContainer == null) {
            var a = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER
                }
            });
            creep.memory.attendedContainer = a[0].id;
            //console.log(creep.memory.attendedContainer);
        }
        else {
            //creep.memory.energySource == null;
            //console.log(creep.memory.attendedContainer.pos.x);
            //console.log(creep + creep.memory.attendedContainer);
            var container = Game.getObjectById(creep.memory.attendedContainer);
            //console.log(container);
            console.log(container.pos.x + "  " + container.pos.y);
            console.log(creep.pos.x + "  " + creep.pos.y);
            console.log(creep.pos.x !== container.pos.x && creep.pos.y !== container.pos.y);
            if(!creep.pos.x !== container.pos.x && creep.pos.y !== container.pos.y) {
                creep.memory.energySource = null;
                creep.moveTo(container.pos.x,container.pos.y, {visualizePathStyle: {stroke: '#cc00ff'}});
                console.log("L1");
            }
            else if(creep.memory.energySource == null) {
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                creep.memory.energySource = source.id;
                if(container.store[RESOURCE_ENERGY] != container.storeCapacity)
                    creep.harvest(source);
                console.log("L2");
            }
            else {
                console.log("L3");
                creep.moveTo(container.pos.x,container.pos.y, {visualizePathStyle: {stroke: '#cc00ff'}});
                var source = Game.getObjectById(creep.memory.energySource);
                if(container.store[RESOURCE_ENERGY] != container.storeCapacity)
                    creep.harvest(source);   
            }
            Memory.containerEnergy += container.store[RESOURCE_ENERGY];
        }
    }
};

module.exports = roleHarvesterv2;