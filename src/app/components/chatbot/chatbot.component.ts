import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { OpenAiService } from '../../core/services/openia.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { marked } from 'marked';
import { IonButton, IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, sendOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

const elementsUI = [
  IonContent,
  IonButton
]; 
@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule, ...elementsUI, RouterLink],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatbotComponent {
  @ViewChild('bottom') bottomRef!: ElementRef;
  userMessage: string = '';
  messages: { id: number; sender: string; text: string }[] = [];

  botResponse: string = 'Bonjour ! Comment puis-je vous aider ?';
  isLoading = false;
  pendingMessageId: number | null = null;

  constructor(private openAiService: OpenAiService, private authService: AuthService) {
    addIcons({ arrowBackOutline, sendOutline });
  }

  async sendMessage() {
    if (!this.userMessage.trim()) return;
    this.isLoading = true;
  
    // Ajouter le message utilisateur
    this.messages.push({ id: Date.now(), sender: 'user', text: this.userMessage });
    this.scrollToBottom();
  
    // Ajouter un message temporaire : "Wellsync rédige une réponse..."
    this.pendingMessageId = Date.now() + 1;
    this.messages.push({
      id: this.pendingMessageId,
      sender: 'bot',
      text: '<em>Wellsync rédige une réponse...</em>'
    });
    this.scrollToBottom();
  
    try {
      const response = await lastValueFrom(this.openAiService.sendMessageToOpenAI(this.userMessage));
  
      // Supprimer le message "en cours..."
      this.messages = this.messages.filter(msg => msg.id !== this.pendingMessageId);
  
      // Ajouter la vraie réponse
      this.messages.push({ id: Date.now(), sender: 'bot', text: response });
      this.scrollToBottom();
  
      // Sauvegarde si connecté
      const user = await firstValueFrom(this.authService.user$);
      if (user?.uid) {
        this.openAiService.saveMessage(user.uid, this.userMessage, response);
      }
  
    } catch (error) {
      this.messages = this.messages.filter(msg => msg.id !== this.pendingMessageId);
      this.messages.push({ id: Date.now(), sender: 'bot', text: '❌ Erreur lors de la récupération de la réponse.' });
    }
  
    this.userMessage = '';
    this.isLoading = false;
    this.pendingMessageId = null;
  }
  
  parseMarkdown(text: string): string {
    return marked.parse(text) as string;
  }
  scrollToBottom() {
    setTimeout(() => {
      this.bottomRef?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }


  onKeyEnter(event: any) {
    const e = event as KeyboardEvent;
    if (!e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }
  
  resizeTextarea(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
