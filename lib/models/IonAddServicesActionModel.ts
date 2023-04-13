import ServiceModel from './ServiceModel.ts';

export default interface IonAddServicesActionModel {
    action: string;
    services: ServiceModel[];
}
