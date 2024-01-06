import ModelInstance from '../objectinstance/ModelInstance';
import {
  LightModelEvent,
  LightSourceEvent,
  ScreenAreaEvent,
  ViewPointEvent,
} from './Event';

interface ListenerBase<T> {
  notify(event: T): void;
}

export interface ViewPointListener extends ListenerBase<ViewPointEvent> {}

export interface ModelInstanceListener extends ListenerBase<ModelInstance> {}

export interface ScreenAreaListener extends ListenerBase<ScreenAreaEvent> {}

export interface LightModelListener extends ListenerBase<LightModelEvent> {}

export interface LightSourceListener extends ListenerBase<LightSourceEvent> {}
