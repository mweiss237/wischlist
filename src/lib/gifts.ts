import { Entry, MultiGift } from "types"

export type GiftTuple = [id: string, gift: MultiGift]

export const NOTE_MAX_LENGTH = 80

// gifts of an entry, oldest first
export const getGifts = (entry?: Entry | null): GiftTuple[] =>
  Object.entries(entry?.gifts || {}).sort(([, a], [, b]) =>
    a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0
  )

// someone committed to this entry, used for the owner's hint and the blur
export const hasCommitment = (entry?: Entry | null) =>
  !!entry?.taken || Object.keys(entry?.gifts || {}).length > 0

// struck through in the share view: taken, or switched back from multi while gifts exist
export const isEntryClosed = (entry?: Entry | null) =>
  !!entry?.taken || (!entry?.multi && hasCommitment(entry))

// a gift belongs to the current giver if it was added on this device or carries their name
export const isOwnGift = (
  [giftId, gift]: GiftTuple,
  ownGiftIds: string[],
  userName?: string | null
) =>
  ownGiftIds.includes(giftId) ||
  (!!gift.giver?.trim() && gift.giver.trim() === userName?.trim())
