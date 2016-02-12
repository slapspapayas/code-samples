For this code sample three data structures matter. Properties irrelevant to the sample have been removed. All of the data is stored as a map.

[ChainTab.js](ChainTab.js) illustrates the rendering of a React component for a tab representing EventChain data. [DataService.js](DataService.js) provides the API for retrieving data from and for updating the data stores.

### Triggers
Triggers are the beginning of the chain, literally, each has a reference to an EventChain by id.

```
{
  "_trigger1": {
    "id": "_trigger1",
    "chainId": "_chain1"
  }
}
```

### EventChains (the main focus)
EventChains may have an array of EventLink ids and a reference to a subsequent EventChain id.

```
{
  "_chain1": {
    "id": "_chain1",
    "name": "test",
    "links": ["_eventLink1", "_eventLink2"],
    "next": "_chain2"
  },
  "_chain2": {
    "id": "_chain2",
    "name": "rawr",
    "links": ["_eventLink3"],
    "next": "_chain3"
  },
  "_chain3": {
    "id": "_chain3",
    "name": "v0mdbi0iv",
    "links": [],
    "next": null
  }
}
```

### EventLinks
EventLinks are the "actions" within an EventChain. The details of their data/implementation are not important for this sample, but they are referenced occasionally.
