export interface NotificationUser {
  _id: string
  name: string
  photo: string
}

export interface NotificationPostEntity {
  _id: string
  id: string
  body: string
  image?: string
  user: string
  commentsCount: number
  likesCount: number
  sharesCount: number
  isShare: boolean
  topComment: unknown | null
}

export interface NotificationUserEntity {
  _id: string
  name: string
  username: string
  photo: string
  followersCount: number

  [key: string]: unknown
}


export interface UnavailableEntity {
  _id: string
  unavailable: true
}

export type NotificationType = "comment_post" | "follow_user" | "like_post" | "share_post"

interface NotificationBase {
  _id: string
  recipient: NotificationUser
  actor: NotificationUser
  entityId: string
  isRead: boolean
  readAt?: string
  createdAt: string
}

export interface PostNotification extends NotificationBase {
  type: "comment_post" | "like_post"
  entityType: "post"
  entity: NotificationPostEntity | UnavailableEntity
}

export interface FollowNotification extends NotificationBase {
  type: "follow_user"
  entityType: "user"
  entity: NotificationUserEntity | UnavailableEntity
}

export type NotificationItemType = PostNotification | FollowNotification