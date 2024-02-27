export enum EventTypes {
  DatabaseConnected = 'database->connected',
  DatabaseReady = 'database->ready',

  DeviceCreate = 'device->create',
  DeviceConnect = 'device->connect',
  DeviceDiscover = 'device->discover',

  DevicesInit = 'devices->init',
  DeviceDone = 'device->done',

  ApplicationDriverReady = 'application->driverReady',
  ApplicationReady = 'application->ready',
}