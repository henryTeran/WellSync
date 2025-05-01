import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OpenAiService } from '../../core/services/openia.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { marked } from 'marked';
import { IonButton, IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, sendOutline } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { MessageTransferService } from '../../core/services/message-transfer.service';

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
export class ChatbotComponent implements ViewWillEnter {
  @ViewChild('bottom') bottomRef!: ElementRef;
  userMessage: string = '';
  messages: { id: number; sender: string; text: string }[] = [];

  botResponse: string = 'Bonjour ! Comment puis-je vous aider ?';
  isLoading = false;
  pendingMessageId: number | null = null;

  constructor(
    private openAiService: OpenAiService, 
    private authService: AuthService,
    private router:Router,
    private messageTransferService: MessageTransferService) {
    addIcons({ arrowBackOutline, sendOutline });
  }

  async ionViewWillEnter() {
  
    const user = await firstValueFrom(this.authService.user$);
    console.log(user)
    if (user?.uid) {
      const history = await this.openAiService.getMessagesForUser(user.uid);
      this.messages = history.map(msg => ({
        id: Date.now() + Math.random(), // pour éviter les conflits
        sender: msg.sender,
        text: msg.text
      }));
      console.log(this.messages)
    }
    const initial = this.messageTransferService.initialMessage;
    console.log(initial)
    if (initial) {
      this.addBotMessage(initial, user!.uid);
      this.messageTransferService.initialMessage = null; // reset
    }

    this.scrollToBottom();
  }

  async addBotMessage(message:string, userUid:string){
    this.messages.push({
      id: Date.now(), sender: 'bot', text: message 
    })
    
    console.log("sauveGroupe")
    await this.openAiService.saveMessageGrouped(userUid, "bot", message); // message initial sans question utilisateur

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
        this.openAiService.saveMessageGrouped(user.uid, this.userMessage, response)
        // this.openAiService.saveMessage(user.uid, this.userMessage, response);
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
