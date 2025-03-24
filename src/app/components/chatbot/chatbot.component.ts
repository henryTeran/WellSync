import { Component } from '@angular/core';
import { OpenAiService } from '../../services/openia.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userMessage: string = '';

  botResponse: string = 'Bonjour ! Comment puis-je vous aider ?';
  isLoading = false;

  constructor(private openAiService: OpenAiService) {}

  async sendMessage() {
    if (!this.userMessage.trim()) return;
    this.isLoading = true;

    try {
      this.botResponse = ' Réponse en cours...';
      const response = await this.openAiService.sendMessageToOpenAI(this.userMessage);
      this.botResponse = response;
    } catch (error) {
      this.botResponse = 'Erreur lors de la récupération de la réponse.';
    }

    this.userMessage = '';
    this.isLoading = false;
  }
}
