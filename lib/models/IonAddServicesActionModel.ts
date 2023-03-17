import DidServiceModel from './DidServiceModel';

export default interface IonAddServicesActionModel {
    action: string;
    services: DidServiceModel[];
}
