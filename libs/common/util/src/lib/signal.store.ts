import { Signal, computed } from '@angular/core';
import { EntityStatus, EntityStatusMap } from '@cv/common/types';
import {
  PartialStateUpdater,
  SignalStoreFeature,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

export type EntityStatusState<Entity extends string> = {
  [KEntity in Entity as `${KEntity}StatusMap`]: EntityStatusMap;
};

export type EntityStatusSignal<Entity extends string> = {
  [KEntity in Entity as `${KEntity}StatusMap`]: Signal<EntityStatusMap>;
};

export type EntityStatusMethods<Entity extends string> = {
  [KEntity in Entity as `${KEntity}Status`]: (
    key: string,
  ) => Signal<EntityStatus>;
};

export function withEntityStatus<Entity extends string>(entity: Entity) {
  const statusMapKey = `${entity}StatusMap` as const;
  const statusKey = `${entity}Status` as const;

  return signalStoreFeature(
    withState({ [statusMapKey]: {} } as EntityStatusState<Entity>),
    withMethods((store) => ({
      [statusKey]: (key: string) =>
        computed(() => {
          return (
            (store as unknown as EntityStatusSignal<Entity>)[statusMapKey]()[
              key
            ] ?? 'unknown'
          );
        }),
    })),
  ) as SignalStoreFeature<
    {
      state: NonNullable<unknown>;
      signals: NonNullable<unknown>;
      methods: NonNullable<unknown>;
    },
    {
      state: EntityStatusState<Entity>;
      signals: NonNullable<unknown>;
      methods: EntityStatusMethods<Entity>;
    }
  >;
}

export function setEntityStatus<Entity extends string>(
  entity: Entity,
  status: EntityStatus,
  ...keys: string[]
) {
  const statusMapKey = `${entity}StatusMap` as const;

  return ((state) => ({
    [statusMapKey]: {
      ...state[statusMapKey],
      ...keys.reduce((map, id) => {
        map[id] = status;
        return map;
      }, {} as EntityStatusMap),
    },
  })) as PartialStateUpdater<EntityStatusState<Entity>>;
}
