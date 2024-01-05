import ScreenAreaEvent from './ScreenAreaEvent';

export default interface ScreenAreaListener {
  notify(event: ScreenAreaEvent): void;
}
