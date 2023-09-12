import { EventEmitter } from 'events';

export const TicEventManager = new EventEmitter();

TicEventManager.setMaxListeners(0);