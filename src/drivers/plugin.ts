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

  get real_plugin_template() {
    return this.plugin_sub_device ? this.plugin_sub_device_template : this.plugin_template;
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

  onInit() {
    if (this.db_device) {
      const device_functions = this.real_plugin_template.device_functions;
      if (device_functions) {
        device_functions.forEach(func => {
          this.addDeviceFunction(func.code, func.name, func.params, func.is_status);
        });
        this.updateDeviceFunctions();
      }
      this.app.subscribe(this.app.eventTypeConnected(this.class_name), () => {
        if (!this.pluginSubDevice) {
          if (this.pluginTemplate.connect_config_new) {
            this.deviceCommand({command: 'settings_new'}).then((response: any) => {
              if (response) {
                response.forEach(item => {
                  this.app.settingsNew[item.class_name] = item;
                });
              }
            }).catch(() => {
            });
          }
          if (this.pluginTemplate.connect_config) {
            this.deviceCommand({command: 'settings'}).then(response => {
              if (response) {
                Object.keys(response).forEach(key => {
                  this.setParam(key, response[key]);
                });
              }
              this.saveDeviceParams();
            }).catch(() => {
            });
          }
        }
      });
      if (this.pluginSubDevice) {
        this.app.subscribe(this.app.eventTypeConnected(this.parent_class_name), () => {
          this.app.addConnectQueue('connectEx', this, true);
        });
      }
      this.statusSubscribe();
    }
  }

}