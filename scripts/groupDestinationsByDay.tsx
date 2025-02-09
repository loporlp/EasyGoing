type Place = {
  alias: string;
  address: string;
  priority: number;
  mode: string;
  transportToNext: string;
  transportDuration: number;
  startDateTime: Date;
  duration: number;
  notes: string;
  dayOrigin: boolean;
  cost: number;
  picture: string;
};

const groupDestinationsByDay = (
groupedDays: { [key: number]: number },
destinations: Place[]
): Place[][] => {
console.log("In groupDestinationsByDay script");
const tempGroupedDestinations: Place[][] = [];

console.log("Destinations (should be ordered):", destinations);

// Iterate over the groupedDays object
Object.keys(groupedDays).forEach((startIndex) => {
  const start = parseInt(startIndex); // Start index
  const end = groupedDays[start]; // End index

  console.log("Processing group:", startIndex);
  console.log("Start Index:", start, "End Index:", end);

  // Extract the corresponding destinations for this day
  const groupForThisDay = destinations.slice(start, end + 1);

  console.log("Group for this day:", groupForThisDay);

  // Add the group to the groupedDestinations array
  tempGroupedDestinations.push(groupForThisDay);

  console.log("Updated Temp Grouped Destinations Length:", tempGroupedDestinations.length);
});

console.log("Temp Grouped Destinations:", tempGroupedDestinations);

// Looping through the structure
tempGroupedDestinations.forEach((group, i) => {
  console.log(`Group ${i + 1}:`);
  group.forEach((item, j) => {
    console.log(`  Item ${j + 1}:`, item);
  });
});

console.log("Done with groupDestinationsByDay script");

return tempGroupedDestinations;
};

export default groupDestinationsByDay;
