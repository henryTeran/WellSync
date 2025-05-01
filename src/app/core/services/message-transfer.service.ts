import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageTransferService {
  
  initialMessage: string | null = null;
}
