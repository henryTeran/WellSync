import { Component } from '@angular/core';
import { OpenAiService } from '../../services/openia.service';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userMessage: string = '';
  messages: { id: number; sender: string; text: string }[] = [];

  botResponse: string = 'Bonjour ! Comment puis-je vous aider ?';
  isLoading = false;

  constructor(private openAiService: OpenAiService, private authService: AuthService) {}

  async sendMessage() {
    if (!this.userMessage.trim()) return;
    this.isLoading = true;

    // Ajouter le message utilisateur
    this.messages.push({ id: Date.now(), sender: 'user', text: this.userMessage });

    try {
        this.botResponse = 'Réponse en cours...';
        const response = await lastValueFrom (this.openAiService.sendMessageToOpenAI(this.userMessage));


        // Ajouter la réponse de l'IA
        this.messages.push({ id: Date.now(), sender: 'bot', text: response });

        // Sauvegarde du message dans la base de données si l'utilisateur est connecté
        this.authService.user$.subscribe(user => {
            if (user?.uid) {
                this.openAiService.saveMessage(user.uid, this.userMessage, response);
            }
        });
    } catch (error) {
        this.messages.push({ id: Date.now(), sender: 'bot', text: 'Erreur lors de la récupération de la réponse.' });
    }

    this.userMessage = '';
    this.isLoading = false;
  }
}
