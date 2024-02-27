import {DbTables} from '../models/db-tables';
import {BaseDriver} from './base-driver';

export class Plugin extends BaseDriver {

  get class_name() {
    return this.plugin_sub_device ? this.plugin_sub_device : this.plugin_template.class_name;
  }

  get plugin_sub_device_template() {
    return this.plugin_sub_device ? this.plugin_template.sub_devices.find(item => item.class_name === this.plugin_sub_device) : null;
  }

  get driver_name() {
    return this.plugin_sub_device ? this.plugin_sub_device_template.name : this.plugin_template.name;
  }

  get description() {
    return this.plugin_sub_device ? this.plugin_sub_device_template.description : this.plugin_template.description;
  }

  validateParams(params) {
    return true;
  }

  error(...message) {
    this.app.error(...arguments)
  }

  updateDriver() {
    this.app.getOrCreateItem(DbTables.Drivers, {
      class_name: this.class_name,
    }, {
      name: this.driver_name,
      description: this.description,
    }).then((driver) => {
      this.db_driver = driver;
    }).catch(error => {
      this.error(error);
    });
  }

}