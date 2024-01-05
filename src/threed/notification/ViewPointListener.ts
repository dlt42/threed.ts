import ViewPointEvent from './ViewPointEvent';

export default interface ViewPointListener {
  notify(event: ViewPointEvent): void;
}
