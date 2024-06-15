// https://developers.homebridge.io/#/service/AccessoryInformation

import { Service } from "homebridge";
import { VehicleAccessory } from "../vehicle.js";

export class AccessoryInformationService {
  service: Service;

  constructor(private parent: VehicleAccessory) {
    this.service = this.parent.accessory.getService(this.parent.platform.Service.AccessoryInformation)!
      .setCharacteristic(
        this.parent.platform.Characteristic.Manufacturer,
        "Tesla"
      )
      .setCharacteristic(
        this.parent.platform.Characteristic.Model,
        this.parent.vehicle.model
      )
      .setCharacteristic(
        this.parent.platform.Characteristic.SerialNumber,
        this.parent.vehicle.vin
      );

    this.service.getCharacteristic(this.parent.platform.Characteristic.Identify)
      .onSet(this.setIdentify.bind(this));

    const version = this.service
      .getCharacteristic(this.parent.platform.Characteristic.FirmwareRevision)
      .onGet(this.getVersion.bind(this));

    this.parent.emitter.on("vehicle_data", () => {
      version.updateValue(this.getVersion());
    });
  }

  getVersion(): string {
    return (
      this.parent.accessory.context?.vehicle_state?.car_version ?? "unknown"
    );
  }

  async setIdentify(): Promise<void> {
    await this.parent.wake_up().then(() => this.parent.vehicle.flash_lights());
  }
}
