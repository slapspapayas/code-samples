import _ from 'lodash';
import * as TriggersStore from 'triggers/TriggersStore';
import * as EventChainsStore from 'events/EventChainsStore';

/**
 * @private
 * @function
 * @name buildChainIdList
 * @param {string} chainId - Id of current EventChain
 * @param {array} chains - Accumulated list of EventChain ids
 * @description - Returns array of ids for all EventChains on active trigger
 * @return {array} Returns EventChain ids
 */
function buildChainIdList(chainId, chains) {
  let chain = EventChainsStore.getEventChainById(chainId);

  if (chain) {
    let { next } = chain;
    if (next) {
      chains.push(next);
      return buildChainIdList(next, chains);
    }
  }

  return chains;
}

/**
 * @function
 * @name getTriggerChains
 * @namespace  DataService.TriggersService.getTriggerChains
 * @param {Trigger} trigger - Trigger for which to retrieve chains
 * @description - Returns an array of EventChain ids on given trigger
 * @return {array} Returns EventChain ids
 */
function getTriggerChains(trigger) {
  if (!trigger) {
    return [];
  }

  let { chainId } = trigger;
  return buildChainIdList(chainId, [chainId]);
}


// Triggers API
export const TriggersService = {
  getTriggerChains
};


/**
 * @function
 * @name setActiveEventChain
 * @namespace  DataService.ChainsService.setActiveEventChain
 * @param {EventChain} chain - EventChain to set
 * @description - Sets active EventChain and emits event to trigger render
 * @return {undefined} Void
 */
function setActiveEventChain(chain) {
  EventChainsStore.setActiveChain(chain);
  Dispatcher.emit(Events.CHAINS.UPDATED);
}

/**
 * @private
 * @function
 * @name findParentChain
 * @param {array} chainIds - Array of string ids
 * @param {string} targetId - Id being searched for
 * @description - Finds parent EventChain to targetId
 * @return {string|undefined} Returns id of parent if found
 */
function findParentChain(chainIds, targetId) {
  return _.find(chainIds, (id) => {
    if (id !== targetId) {
      let chain = EventChainsStore.getEventChainById(id);
      return chain.next === targetId;
    }
    return false;
  });
}

/**
 * @private
 * @function
 * @name removeChainRefs
 * @param {EventChain} chain - Chain to remove references to
 * @param {Trigger} activeTrigger - The current active trigger
 * @param {array} triggerChains - Array of trigger's chain ids
 * @description - Removes references of chain from parent object
 * @return {EventChain} Returns the updated parent chain
 */
function removeChainRefs(chain, activeTrigger, triggerChains) {
  let { id, next } = chain;

  // Target deletion is the first in the series so it's referenced on the trigger
  if (id === activeTrigger.chainId) {

    // Update the active trigger with deleted chain's next
    let updatedTrigger = TriggersStore.update(activeTrigger, {chainId: next});
    return EventChainsStore.getEventChainById(updatedTrigger.chainId);
  }

  // Find parent chain and update its next property
  let parentChainId = findParentChain(triggerChains, id);
  let parentChain = EventChainsStore.getEventChainById(parentChainId);
  return EventChainsStore.updateChain(parentChain, { next });
}

/**
 * @function
 * @name deleteChain
 * @namespace  DataService.ChainsService.deleteChain
 * @param {EventChain} chain - Chain to delete
 * @param {Trigger} activeTrigger - The current active trigger
 * @param {array} triggerChains - String ids of all chains belonging to activeTrigger
 * @description - Handles the deletion of an EventChain, its EventLinks and its refs
 * @return {EventChain} Returns new active EventChain
 */
function deleteChain(chain, activeTrigger, triggerChains) {

  // Deletion should be safe, but best not to assume
  if (triggerChains.length < 2) {
    return;
  }

  // Delete links of chain
  _deleteEventLinks(chain.links);

  // Update parent object to remove refs to target chain
  let newActiveChain = removeChainRefs(chain, activeTrigger, triggerChains);

  // Delete chain
  EventChainsStore.remove(chain);

  // Update active chain
  setActiveEventChain(newActiveChain);
  return newActiveChain;
}


// EventChains API
export let ChainsService = {
  deleteChain,
  setActiveEventChain
};
