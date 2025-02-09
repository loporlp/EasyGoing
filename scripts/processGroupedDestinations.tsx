const processGroupedDestinations = (orderedLocations: string[], groupedDestinations: any[], destinations: any[], fetchedDurations: any[], setGroupedDestinations: Function) => {
  console.log("In processGroupedDestinations script");

  // Create a map of ordered locations for quick lookup
  const orderedLocationsMap = orderedLocations.reduce((acc, location, index) => {
    acc[location] = index;
    return acc;
  }, {});

  // Sort groupedDestinations based on orderedLocationsMap
  const sortedGroupedDestinations = groupedDestinations.map(group => {
    return group.sort((a, b) => {
      const indexA = orderedLocationsMap[a.alias];
      const indexB = orderedLocationsMap[b.alias];
      return indexA - indexB;
    });
  });

  // Set the sorted destinations to state
  setGroupedDestinations(sortedGroupedDestinations);

  // Location Duration in Dictionary. exp: "New York": 3600
  const locationDurations = Object.values(destinations).map(destination => ({
    name: destination.alias,
    duration: destination.duration
  }));

  console.log("Location Durations in Dict:", locationDurations);

  // Contains origin, destination, mode, transportDuration (duration), and locationDuration
  const updatedDurations = fetchedDurations.map(route => {
    const originAlias = route.origin[0];
    const locationEntry = locationDurations.find(entry => entry.name === originAlias);
    const locationDuration = locationEntry ? locationEntry.duration : 3600; // Default to 3600 (1 hour) if no locationDuration is found
    return { ...route, locationDuration };
  });

  // Need to add the last location
  const lastLocation = fetchedDurations[fetchedDurations.length - 1];
  const lastLocationAlias = lastLocation.destination[0];
  const lastLocationEntry = locationDurations.find(entry => entry.name === lastLocationAlias);
  const lastLocationDuration = lastLocationEntry ? lastLocationEntry.duration : 3600;

  const lastLocationEntryObj = {
    origin: lastLocationAlias,
    destination: null,
    mode: null,
    duration: null,
    locationDuration: lastLocationDuration
  };

  updatedDurations.push(lastLocationEntryObj);
  console.log("Updated Durations with last entry:", updatedDurations);

  console.log("Done with processGroupedDestinations script");

  return updatedDurations;
};

export default processGroupedDestinations;