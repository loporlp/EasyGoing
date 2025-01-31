//a 'destination' is one of many destinations in a trip, import Trip to import this as well
export interface Destination {
    destinationID: number;
    alias: string; // the written address
    address: string; // the lat/long address
    priority: number; // priority
    mode: string; // mode of transport
    transportToNext?: string; // where to go next
    transportDuration: string; // duration of transport
    startDateTime: string; // when (DateTime) the destination is visited
    duration: string; // how long the visit is
    notes?: string; // any notes the user has
    dayOrigin: boolean; // if this is the first place visited on a specific day or not
    cost: number; // cost of destination (if any)
    picture?: string; // JSON serialized image
  }
  //the trip itself
  export interface Trip {
    tripName: string; // name of the trip
    tripStartDate: string; // starting date of trip
    tripEndDate: string; // ending date of trip
    budget: number; // total trip budget
    origin: string; // city that a trip starts in
    destinations: Destination[];
  }
  