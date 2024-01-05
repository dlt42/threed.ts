import LightSourceEvent from './LightSourceEvent';

export default interface LightSourceListener {
  notify(event: LightSourceEvent): void;
}
