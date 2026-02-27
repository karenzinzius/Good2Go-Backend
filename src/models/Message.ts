export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  itemId: number;
  timestamp: Date;
}
export const messages: Message[] = [];
