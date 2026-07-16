import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { ChatMessage } from '../interfaces';
import { AiApiService } from './ai-api.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private readonly firestore: Firestore,
    private readonly aiApiService: AiApiService,
  ) {}

  async getMessagesForUser(userId: string): Promise<{ sender: string; text: string }[]> {
    const snapshot = await getDocs(
      query(
        collection(this.firestore, 'chatMessages'),
        where('userId', '==', userId),
        orderBy('createdAt', 'asc'),
      ),
    );

    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data() as ChatMessage;
      return {
        sender: data.role === 'assistant' ? 'bot' : data.role,
        text: data.content,
      };
    });
  }

  async saveMessage(userId: string, role: ChatMessage['role'], content: string, contextType = 'chat'): Promise<void> {
    await addDoc(collection(this.firestore, 'chatMessages'), {
      userId,
      role,
      content,
      contextType,
      createdAt: new Date(),
    });
  }

  async askAssistant(message: string): Promise<string> {
    return this.aiApiService.chat(message);
  }
}
