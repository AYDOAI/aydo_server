import {toExtendable, Extendable, Mixin} from '../lib/foibles';
import {RequireEx} from '../lib/require-ex';
import {ConfigFile} from './models/config-file';
import {Config} from './mixins/config';
import {Log} from './mixins/log';
import {Database} from './mixins/database';
import {RestApi} from './mixins/rest-api';
import {Emitter} from './mixins/emitter';
import {Drivers} from './mixins/drivers';
import {Devices} from './mixins/devices';
import {IPC} from './mixins/ipc';
import {Controllers} from './controllers';

const Base = toExtendable(class BaseClass {

  load(options: AppOptions) {
  }

  terminate() {
  }

});

type Base = Extendable<typeof Base>;
type Config = Mixin<typeof Config>;
type Database = Mixin<typeof Database>;
type Emitter = Mixin<typeof Emitter>;
type Log = Mixin<typeof Log>;
type RestApi = Mixin<typeof RestApi>;
type Drivers = Mixin<typeof Drivers>;
type Devices = Mixin<typeof Devices>;

export interface AppOptions {
  requireEx: RequireEx;
  config: ConfigFile;
  configPath: string;
}

export class App extends Base.with(Config, Database, Emitter, Log, RestApi, Drivers, Devices, IPC) {
  version = '3.0.0';
  requireEx: RequireEx;

  load(options: AppOptions) {
    this.requireEx = options.requireEx;
    this.controllers = new Controllers(this);

    super.load(options);
  }

  terminate() {
    super.terminate();
  }

  findDriverByClassName(class_name) {
    let result = null;
    const drivers = this.drivers;
    Object.keys(drivers).forEach(key => {
      if (drivers[key].class_name === class_name) {
        result = drivers[key];
      }
    });
    return result;
  }

}