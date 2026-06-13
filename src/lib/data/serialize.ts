/**
 * Convert a Mongoose lean document into a plain, JSON-safe object:
 * ObjectId -> hex string, Date -> ISO string. Required because results flow
 * through Next's data cache and across the server/client boundary.
 */
export function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
