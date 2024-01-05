import LightModelEvent from './LightModelEvent';

export default interface LightModelListener {
  notify(event: LightModelEvent): void;
}
