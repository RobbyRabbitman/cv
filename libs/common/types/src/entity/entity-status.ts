export const ENTITY_STATUS = [
  'unknown',
  'loading',
  'success',
  'error',
] as const;

export type EntityStatus = (typeof ENTITY_STATUS)[number];

export type EntityStatusMap = Record<string, EntityStatus>;

/**
 * Returns a new status map with the specified keys updated to the new status.
 *
 * - If keys do not exist in the original map, it will be added with the new
 *   status.
 */
export function patchEntityStatus(
  target: EntityStatusMap,
  newStatus: EntityStatus,
  ...keys: string[]
): EntityStatusMap {
  return {
    ...target,
    ...keys.reduce((updatedStatusMap, id) => {
      updatedStatusMap[id] = newStatus;
      return updatedStatusMap;
    }, {} as EntityStatusMap),
  };
}
