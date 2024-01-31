export const ENTITY_STATUS = [
  'unknown',
  'loading',
  'success',
  'error',
] as const;

export type EntityStatus = (typeof ENTITY_STATUS)[number];

export type EntityStatusMap = Record<string, EntityStatus>;

export function patchEntityStatus(
  statusMap: EntityStatusMap,
  status: EntityStatus,
  ...keys: string[]
): EntityStatusMap {
  return {
    ...statusMap,
    ...keys.reduce((map, id) => {
      map[id] = status;
      return map;
    }, {} as EntityStatusMap),
  };
}
