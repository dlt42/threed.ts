import ModelInstance from '../objectinstance/ModelInstance';

export default interface ModelInstanceListener {
  notify(model: ModelInstance): void;
}
